import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Add paths that don't require authentication
const publicPaths = ['/login', '/public'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static files, api routes, and public paths
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') || 
    publicPaths.some(path => pathname.startsWith(path))
  ) {
    // If user is already logged in and tries to access login page, redirect to dashboard
    if (pathname === '/login') {
      const session = request.cookies.get('session')?.value;
      if (session) {
        try {
          const parsed = await decrypt(session);
          if (parsed) {
            return NextResponse.redirect(new URL('/', request.url));
          }
        } catch (e) {}
      }
    }
    return NextResponse.next();
  }

  // 2. Check for session
  const session = request.cookies.get('session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const parsed = await decrypt(session);
    if (!parsed) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    // Session is invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('session', '', { expires: new Date(0) });
    return response;
  }
}

// Optionally, configure which paths the middleware runs on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
