"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteStudent(id: string) {
    // Delete related records first to maintain relational integrity
    await prisma.feePayment.deleteMany({ where: { studentId: id } });
    await prisma.classSchedule.deleteMany({ where: { studentId: id } });
    await prisma.testSchedule.deleteMany({ where: { studentId: id } });
    await prisma.document.deleteMany({ where: { studentId: id } });
    
    // Delete the student
    await prisma.student.delete({
        where: { id }
    });
    
    // Revalidate the list page so the deleted student disappears immediately
    revalidatePath("/students");
}
