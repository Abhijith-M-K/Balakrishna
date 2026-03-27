import prisma from "@/lib/prisma";
import { AdditionalClassForm } from "../AdditionalClassForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function NewAdditionalClassPage() {
    // Fetch all students to allow selection, including completed ones as requested
    const students = await prisma.student.findMany({
        orderBy: { name: 'asc' },
        select: {
            id: true,
            studentId: true,
            name: true,
            status: true
        }
    });

    return (
        <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem" }}>
                <Link href="/additional-classes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                    <ArrowLeft size={16} /> Back to List
                </Link>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--text-primary)" }}>Record Additional Class</h1>
                <p className="text-muted">Enter details for extra training sessions provided to students.</p>
            </div>

            <div className="glass-card" style={{ padding: "2rem" }}>
                <AdditionalClassForm students={students as any} />
            </div>
        </div>
    );
}
