import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { EditStudentForm } from "./EditStudentForm";

export default async function EditStudentPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    
    let student;
    try {
        student = await prisma.student.findUnique({
            where: { id }
        });
    } catch (e) {
        return notFound();
    }

    if (!student) {
        return notFound();
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href={`/students/${id}`} className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Edit Student: {student.name}</h1>
                    <p className="text-muted">Update applicant details and training status.</p>
                </div>
            </header>

            <div className="glass-card" style={{ maxWidth: "800px", padding: "2rem" }}>
                <EditStudentForm student={student} />
            </div>
        </div>
    );
}
