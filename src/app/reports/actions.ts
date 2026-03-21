"use server";

import prisma from "@/lib/prisma";
import { Student, FeePayment, TestSchedule, Trainer, Vehicle } from "@prisma/client";

export async function getStudentReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
        where.registrationDate = {};
        if (startDate) where.registrationDate.gte = startDate;
        if (endDate) where.registrationDate.lte = endDate;
    }

    return await prisma.student.findMany({
        where,
        orderBy: { registrationDate: 'desc' },
        include: {
            assignedTrainer: true,
            _count: {
                select: { classSchedules: true, testSchedules: true }
            }
        }
    });
}

export async function getFeeCollectionReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
        where.paymentDate = {};
        if (startDate) where.paymentDate.gte = startDate;
        if (endDate) where.paymentDate.lte = endDate;
    }

    return await prisma.feePayment.findMany({
        where,
        include: { student: true },
        orderBy: { paymentDate: 'desc' }
    });
}

export async function getPendingPaymentReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
        where.registrationDate = {};
        if (startDate) where.registrationDate.gte = startDate;
        if (endDate) where.registrationDate.lte = endDate;
    }

    const students = await prisma.student.findMany({
        where,
        include: {
            feePayments: {
                select: { paidAmount: true }
            }
        }
    });

    return students.map((student: any) => {
        const totalPaid = student.feePayments.reduce((sum: number, p: { paidAmount: number }) => sum + p.paidAmount, 0);
        const balance = student.totalFee - totalPaid;
        return {
            ...student,
            totalPaid,
            balance
        };
    }).filter((s: any) => s.balance > 0);
}

export async function getTestOutcomeReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
        where.testDate = {};
        if (startDate) where.testDate.gte = startDate;
        if (endDate) where.testDate.lte = endDate;
    }

    const tests = await prisma.testSchedule.findMany({
        where,
        include: { student: true },
        orderBy: { testDate: 'desc' }
    });

    const stats = {
        total: tests.length,
        passed: tests.filter((t: TestSchedule) => t.status === 'PASSED').length,
        failed: tests.filter((t: TestSchedule) => t.status === 'FAILED').length,
        pending: tests.filter((t: TestSchedule) => t.status === 'PENDING').length
    };

    return { tests, stats };
}

export async function getTrainerPerformanceReport(startDate?: Date, endDate?: Date) {
    // For trainers, we'll return all trainers but we might need to filter the stats in the future.
    // For now, let's just return all as it's an audit of staff.
    return await prisma.trainer.findMany({
        include: {
            _count: { select: { classSchedules: true, students: true } },
            students: {
                include: { testSchedules: true }
            }
        }
    });
}

export async function getVehicleUsageReport(startDate?: Date, endDate?: Date) {
    return await prisma.vehicle.findMany({
        include: {
            _count: { select: { classSchedules: true, testSchedules: true } }
        }
    });
}

export async function getMonthlyIncomeReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate || endDate) {
        where.paymentDate = {};
        if (startDate) where.paymentDate.gte = startDate;
        if (endDate) where.paymentDate.lte = endDate;
    }

    const payments = await prisma.feePayment.findMany({
        where,
        select: { paidAmount: true, paymentDate: true }
    });

    const monthlyData: Record<string, number> = {};
    payments.forEach((p: { paidAmount: number, paymentDate: Date }) => {
        const monthKey = p.paymentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + p.paidAmount;
    });

    return Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
}
