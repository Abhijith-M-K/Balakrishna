const mysql = require('mysql2/promise');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  const envPath = path.join(process.cwd(), '.env');
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error('Error: DB_HOST, DB_USER, and DB_NAME must be set in your .env file.');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MySQL server at ${DB_HOST}...`);
    const isCloud = DB_HOST.includes('tidbcloud.com') || DB_HOST.includes('aivencloud.com');
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: parseInt(DB_PORT || '3306', 10),
      ssl: isCloud ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      } : undefined
    });

    console.log(`Creating database "${DB_NAME}" if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.end();

    // Fix: Construct a valid DATABASE_URL (encoded) and update .env
    // This is because Prisma doesn't support variable interpolation and requires URL encoding for special chars like '@'
    const encodedUser = encodeURIComponent(DB_USER);
    const encodedPass = encodeURIComponent(DB_PASSWORD);
    
    // Add SSL support for cloud providers (TiDB/Aiven require ssl-mode)
    const sslParam = isCloud ? '&sslaccept=strict' : '';
    const fullUrl = `mysql://${encodedUser}:${encodedPass}@${DB_HOST}:${DB_PORT}/${DB_NAME}?${sslParam}`;
    
    console.log('Syncing DATABASE_URL in .env...');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${fullUrl}"`);
    } else {
      envContent += `\nDATABASE_URL="${fullUrl}"`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env with correctly encoded DATABASE_URL.');

    console.log(`\nDatabase "${DB_NAME}" is ready. Synchronizing tables with Prisma...`);
    
    // Run npx prisma db push with the new DATABASE_URL explicitly to avoid stale process.env
    execSync(`DATABASE_URL="${fullUrl}" npx prisma db push`, { stdio: 'inherit' });

    console.log('\n✅ Database and tables setup complete!');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Is your MySQL server running?');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Please check your DB_USER and DB_PASSWORD.');
    }
    process.exit(1);
  }
}

setup();
