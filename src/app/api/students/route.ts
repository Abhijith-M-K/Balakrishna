import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LicenseType, StudentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const students = await prisma.student.findMany({
            include: {
                assignedTrainer: true,
                assignedVehicle: true,
                feePayments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ success: true, data: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Auto-generate a Student ID (e.g., STU-001, STU-1024)
        const count = await prisma.student.count();
        const newStudentId = `STU-${(count + 1).toString().padStart(3, '0')}`;

        const student = await prisma.student.create({
            data: {
                studentId: newStudentId,
                name: body.name,
                phoneNumber: body.phoneNumber,
                address: body.address,
                licenseType: body.licenseType as LicenseType,
                status: body.status as StudentStatus || 'ENROLLED',
            },
        });

        return NextResponse.json({ success: true, data: student }, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ success: false, error: 'Failed to create student' }, { status: 500 });
    }
}
