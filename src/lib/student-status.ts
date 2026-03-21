import prisma from "./prisma";
import { StudentStatus } from "@prisma/client";

/**
 * Re-evaluates and synchronizes a student's status based on their associated
 * class schedules and test results.
 */
export async function syncStudentStatus(studentId: string) {
    if (!studentId) return;

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            classSchedules: {
                select: { id: true }
            },
            testSchedules: {
                select: { status: true }
            }
        }
    });

    if (!student) return;

    let newStatus: StudentStatus = "ENROLLED";

    // Priority 1: COMPLETED (Any passed test)
    if (student.testSchedules.some((t: { status: string }) => t.status === "PASSED")) {
        newStatus = "COMPLETED";
    } 
    // Priority 2: TEST_SCHEDULED (Any pending test)
    else if (student.testSchedules.some((t: { status: string }) => t.status === "PENDING")) {
        newStatus = "TEST_SCHEDULED";
    } 
    // Priority 3: TRAINING (Any class schedules)
    else if (student.classSchedules.length > 0) {
        newStatus = "TRAINING";
    } 
    // Priority 4: ENROLLED (Default)
    else {
        newStatus = "ENROLLED";
    }

    // Only update if status has changed
    if (student.status !== newStatus) {
        await prisma.student.update({
            where: { id: studentId },
            data: { status: newStatus }
        });
    }

    return newStatus;
}
