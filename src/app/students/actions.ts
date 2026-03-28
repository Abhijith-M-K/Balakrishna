"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function addStudentAction(formData: FormData) {
    // We only create basic student fields in this form
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const dateOfBirthStr = formData.get("dateOfBirth") as string;
    const idProofNumber = formData.get("idProofNumber") as string;
    const dateOfBirth = dateOfBirthStr ? new Date(dateOfBirthStr) : null;
    const totalFee = parseFloat(formData.get("totalFee") as string) || 0;
    const licenseType = formData.get("licenseType") as "LMV" | "MCWG" | "BOTH" | "HMV";
    
    // Simple id generator for studentId
    const studentId = `STU-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
        await prisma.student.create({
            data: {
                studentId,
                name,
                phoneNumber,
                address,
                dateOfBirth,
                idProofNumber,
                totalFee,
                licenseType,
                status: "ENROLLED"
            }
        });
    } catch (error: any) {
        console.error("Add student error:", error);
        return { error: error?.message || "Failed to add student. Please check the data and try again." };
    }

    redirect("/students");
}

export async function updateStudentStatusAction(id: string, status: any) {
    try {
        await prisma.student.update({
            where: { id },
            data: { status }
        });
        return { success: true };
    } catch (error: any) {
        return { error: error?.message || "Failed to update status" };
    }
}

export async function updateStudentAction(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const dateOfBirthStr = formData.get("dateOfBirth") as string;
    const idProofNumber = formData.get("idProofNumber") as string;
    const dateOfBirth = dateOfBirthStr ? new Date(dateOfBirthStr) : null;
    const totalFee = parseFloat(formData.get("totalFee") as string) || 0;
    const licenseType = formData.get("licenseType") as "LMV" | "MCWG" | "BOTH" | "HMV";
    const status = formData.get("status") as "ENROLLED" | "TRAINING" | "TEST_SCHEDULED" | "COMPLETED";
    
    try {
        await prisma.student.update({
            where: { id },
            data: {
                name,
                phoneNumber,
                address,
                dateOfBirth,
                idProofNumber,
                totalFee,
                licenseType,
                status
            }
        });
    } catch (error: any) {
        console.error("Update student error:", error);
        return { error: error?.message || "Failed to update student details." };
    }

    redirect(`/students/${id}`);
}

export async function deleteStudent(id: string) {
    try {
        await prisma.student.delete({
            where: { id }
        });
        revalidatePath("/students");
        return { success: true };
    } catch (error: any) {
        console.error("Delete student error:", error);
        return { error: error?.message || "Failed to delete student record." };
    }
}
