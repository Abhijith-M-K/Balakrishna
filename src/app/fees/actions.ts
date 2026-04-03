"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addFeePayment(formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const paidAmount = parseFloat(formData.get("paidAmount") as string);
    const paymentMethod = formData.get("paymentMethod") as "CASH" | "UPI" | "BANK_TRANSFER";

    if (!studentId || isNaN(paidAmount)) {
        throw new Error("Invalid form data");
    }

    // Securely pull historical payments from DB to prevent client-side hacks
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { feePayments: true }
    });

    if (!student) throw new Error("Student not found");

    const totalPaidSoFar = student.feePayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const balanceBeforeThis = student.totalFee - totalPaidSoFar;
    const newBalance = balanceBeforeThis - paidAmount;
    
    // Generate unique receipt number
    const receiptNumber = `REC-${Math.floor(10000 + Math.random() * 90000)}`;

    await prisma.feePayment.create({
        data: {
            studentId,
            totalFee: student.totalFee,
            paidAmount,
            balance: newBalance,
            paymentMethod,
            receiptNumber
        }
    });

    revalidatePath("/fees");
    revalidatePath(`/students/${studentId}`);
    redirect("/fees");
}

export async function deleteFeePayment(id: string) {
    try {
        const payment = await prisma.feePayment.findUnique({
            where: { id },
            select: { studentId: true }
        });

        if (!payment) throw new Error("Payment record not found");

        await prisma.feePayment.delete({
            where: { id }
        });

        revalidatePath("/fees");
        revalidatePath(`/students/${payment.studentId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Delete error:", error);
        return { error: error.message || "Failed to delete payment record" };
    }
}
