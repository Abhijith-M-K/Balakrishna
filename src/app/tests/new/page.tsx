import Link from "next/link";
import { ArrowLeft, FileBadge, Save } from "lucide-react";
import prisma from "@/lib/prisma";
import { scheduleTest } from "../actions";
import StudentSearchSelect from "@/components/ui/StudentSearchSelect";

import TestForm from "./TestForm";

export const dynamic = 'force-dynamic';

export default async function NewTestPage() {
    const [students, vehicles] = await Promise.all([
        prisma.student.findMany({ 
            where: { status: { in: ["ENROLLED", "TRAINING"] } }, 
            orderBy: { name: "asc" } 
        }),
        prisma.vehicle.findMany({ 
            orderBy: { registrationNumber: "asc" } 
        })
    ]);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/tests" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Test List
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileBadge size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Schedule Driving Test</h1>
                        <p className="text-muted">Register a student for their official RTO driving test.</p>
                    </div>
                </div>
            </header>

            <TestForm students={students} vehicles={vehicles} />
            
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
