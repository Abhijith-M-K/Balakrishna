import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PaymentMethod } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        const query: any = {
            include: {
                student: {
                    select: { name: true, studentId: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        };

        // If studentId is provided, filter payments for that student
        if (studentId) {
            query.where = { studentId };
        }

        const payments = await prisma.feePayment.findMany(query);
        return NextResponse.json({ success: true, data: payments });
    } catch (error) {
        console.error('Error fetching fees:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch payment records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Auto-generate a Receipt Number
        const count = await prisma.feePayment.count();
        const newReceiptId = `REC-${(count + 1).toString().padStart(4, '0')}`;

        // Get previous balance from student (Mock logic: balance = totalFee - paidAmount)
        // If you want robust tracking, query previous payments for the same student.

        const payment = await prisma.feePayment.create({
            data: {
                studentId: body.studentId, // Ensure this maps to a valid Student internal `id` UUID 
                totalFee: parseFloat(body.totalFee),
                paidAmount: parseFloat(body.paidAmount),
                balance: parseFloat(body.totalFee) - parseFloat(body.paidAmount),
                paymentMethod: body.paymentMethod as PaymentMethod,
                receiptNumber: newReceiptId,
            },
        });

        return NextResponse.json({ success: true, data: payment }, { status: 201 });
    } catch (error) {
        console.error('Error recording payment:', error);
        return NextResponse.json({ success: false, error: 'Failed to record payment' }, { status: 500 });
    }
}
