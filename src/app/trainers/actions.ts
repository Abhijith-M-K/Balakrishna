"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTrainer(formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const licenseNumber = formData.get("licenseNumber") as string;
    const experienceStr = formData.get("experience") as string;
    const assignedVehicleId = formData.get("assignedVehicleId") as string;

    const experience = experienceStr ? parseInt(experienceStr, 10) : null;

    if (!name || !phone || !licenseNumber) {
        throw new Error("Required fields missing");
    }

    try {
        await prisma.trainer.create({
            data: {
                name,
                phone,
                licenseNumber,
                experience,
                assignedVehicleId: assignedVehicleId || null
            }
        });
    } catch (error) {
        console.error("Failed to add trainer:", error);
        throw new Error("Failed to add trainer to database");
    }

    revalidatePath("/trainers");
    redirect("/trainers");
}

export async function editTrainer(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const licenseNumber = formData.get("licenseNumber") as string;
    const experienceStr = formData.get("experience") as string;
    const assignedVehicleId = formData.get("assignedVehicleId") as string;

    const experience = experienceStr ? parseInt(experienceStr, 10) : null;

    if (!name || !phone || !licenseNumber) {
        throw new Error("Required fields missing");
    }

    try {
        await prisma.trainer.update({
            where: { id },
            data: {
                name,
                phone,
                licenseNumber,
                experience,
                assignedVehicleId: assignedVehicleId || null
            }
        });
    } catch (error) {
        console.error("Failed to update trainer:", error);
        throw new Error("Failed to update trainer");
    }

    revalidatePath("/trainers");
    redirect("/trainers");
}
