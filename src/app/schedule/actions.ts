"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { syncStudentStatus } from "@/lib/student-status";

export async function scheduleClass(formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const trainerId = formData.get("trainerId") as string;
    const vehicleId = formData.get("vehicleId") as string;
    const dateStr = formData.get("date") as string;
    const startTimeStr = formData.get("startTime") as string;
    const endTimeStr = formData.get("endTime") as string;

    if (!studentId || !trainerId || !vehicleId || !dateStr || !startTimeStr || !endTimeStr) {
        throw new Error("Missing required scheduling fields");
    }

    const classDate = new Date(dateStr);
    const startDateTime = new Date(`${dateStr}T${startTimeStr}:00`);
    const endDateTime = new Date(`${dateStr}T${endTimeStr}:00`);

    try {
        await prisma.classSchedule.create({
            data: {
                studentId,
                trainerId,
                vehicleId,
                date: classDate,
                startTime: startDateTime,
                endTime: endDateTime,
                attended: false
            }
        });

        // Sync student status
        await syncStudentStatus(studentId);
    } catch (error) {
        console.error("Failed to schedule class:", error);
        throw new Error("Failed to insert class schedule");
    }

    revalidatePath("/schedule");
    redirect("/schedule");
}

export async function toggleAttendance(id: string, currentStatus: boolean) {
    try {
        await prisma.classSchedule.update({
            where: { id },
            data: { attended: !currentStatus }
        });
        revalidatePath("/schedule");
    } catch (error) {
        console.error("Failed to toggle attendance:", error);
        throw new Error("Failed to update status");
    }
}

export async function editSchedule(id: string, formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const trainerId = formData.get("trainerId") as string;
    const vehicleId = formData.get("vehicleId") as string;
    const dateStr = formData.get("date") as string;
    const startTimeStr = formData.get("startTime") as string;
    const endTimeStr = formData.get("endTime") as string;

    if (!studentId || !trainerId || !vehicleId || !dateStr || !startTimeStr || !endTimeStr) {
        throw new Error("Missing required scheduling fields");
    }

    const classDate = new Date(dateStr);
    const startDateTime = new Date(`${dateStr}T${startTimeStr}:00`);
    const endDateTime = new Date(`${dateStr}T${endTimeStr}:00`);

    try {
        const existing = await prisma.classSchedule.findUnique({ where: { id } });
        if (existing?.attended) {
            throw new Error("Cannot reschedule a completed session");
        }

        await prisma.classSchedule.update({
            where: { id },
            data: {
                studentId,
                trainerId,
                vehicleId,
                date: classDate,
                startTime: startDateTime,
                endTime: endDateTime
            }
        });

        // Sync student status
        await syncStudentStatus(studentId);
    } catch (error) {
        console.error("Failed to update schedule:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to update schedule");
    }

    revalidatePath("/schedule");
    redirect("/schedule");
}
