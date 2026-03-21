"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addVehicle(formData: FormData) {
    const registrationNumber = formData.get("registrationNumber") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const insuranceExpiryStr = formData.get("insuranceExpiry") as string;
    const serviceReminderStr = formData.get("serviceReminder") as string;

    if (!registrationNumber || !vehicleType) {
        throw new Error("Required fields missing");
    }

    try {
        await prisma.vehicle.create({
            data: {
                registrationNumber: registrationNumber.trim().toUpperCase(),
                vehicleType,
                insuranceExpiry: insuranceExpiryStr ? new Date(insuranceExpiryStr) : null,
                serviceReminder: serviceReminderStr ? new Date(serviceReminderStr) : null,
            }
        });
    } catch (error) {
        console.error("Failed to add vehicle:", error);
        throw new Error("Failed to add vehicle to database");
    }

    revalidatePath("/vehicles");
    redirect("/vehicles");
}

export async function editVehicle(id: string, formData: FormData) {
    const registrationNumber = formData.get("registrationNumber") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const insuranceExpiryStr = formData.get("insuranceExpiry") as string;
    const serviceReminderStr = formData.get("serviceReminder") as string;

    if (!registrationNumber || !vehicleType) {
        throw new Error("Required fields missing");
    }

    try {
        await prisma.vehicle.update({
            where: { id },
            data: {
                registrationNumber: registrationNumber.trim().toUpperCase(),
                vehicleType,
                insuranceExpiry: insuranceExpiryStr ? new Date(insuranceExpiryStr) : null,
                serviceReminder: serviceReminderStr ? new Date(serviceReminderStr) : null,
            }
        });
    } catch (error) {
        console.error("Failed to update vehicle:", error);
        throw new Error("Failed to update vehicle");
    }

    revalidatePath("/vehicles");
    redirect("/vehicles");
}
