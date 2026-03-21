"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TestStatus } from "@prisma/client";
import { syncStudentStatus } from "@/lib/student-status";

export async function scheduleTest(formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const vehicleId = formData.get("vehicleId") as string;
    const testDateStr = formData.get("testDate") as string;

    if (!studentId || !testDateStr) {
        throw new Error("Missing required test scheduling fields");
    }

    const testDate = new Date(testDateStr);

    try {
        await prisma.testSchedule.create({
            data: {
                studentId,
                vehicleId: vehicleId || null,
                testDate,
                status: "PENDING"
            }
        });

        // Sync student status
        await syncStudentStatus(studentId);
    } catch (error) {
        console.error("Failed to schedule test:", error);
        throw new Error("Failed to schedule test");
    }

    revalidatePath("/tests");
    redirect("/tests");
}

export async function updateTestStatus(id: string, status: TestStatus) {
    try {
        const test = await prisma.testSchedule.update({
            where: { id },
            data: { status }
        });

        // Sync student status
        await syncStudentStatus(test.studentId);

        revalidatePath("/tests");
        revalidatePath("/students");
    } catch (error) {
        console.error("Failed to update test status:", error);
        throw new Error("Failed to update test status");
    }
}
