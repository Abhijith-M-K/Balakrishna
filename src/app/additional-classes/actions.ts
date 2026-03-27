"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LicenseType, PaymentMethod } from "@prisma/client";

export async function addAdditionalClassAction(formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentMethod = formData.get("paymentMethod") as PaymentMethod;
    const licenseType = formData.get("licenseType") as LicenseType;
    const notes = formData.get("notes") as string;

    if (!studentId || isNaN(amount) || !licenseType) {
        return { error: "Missing required fields" };
    }

    // Generate unique receipt number
    const receiptNumber = `ADD-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
        await prisma.additionalClass.create({
            data: {
                studentId,
                amount,
                paymentMethod,
                licenseType,
                receiptNumber,
                notes
            }
        });
    } catch (error: any) {
        console.error("Add additional class error:", error);
        return { error: "Failed to record additional class. " + error.message };
    }

    revalidatePath("/additional-classes");
    revalidatePath(`/students/${studentId}`);
    redirect("/additional-classes");
}
