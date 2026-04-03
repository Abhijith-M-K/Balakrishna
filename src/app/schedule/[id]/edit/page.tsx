import Link from "next/link";
import { ArrowLeft, Edit3, Save } from "lucide-react";
import prisma from "@/lib/prisma";
import { editSchedule } from "../../actions";
import { notFound, redirect } from "next/navigation";
import StudentSearchSelect from "@/components/ui/StudentSearchSelect";

import EditScheduleForm from "./EditScheduleForm";

export default async function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [schedule, students, trainers, vehicles] = await Promise.all([
        prisma.classSchedule.findUnique({ where: { id } }),
        prisma.student.findMany({ where: { status: { in: ["ENROLLED", "TRAINING"] } }, orderBy: { name: "asc" } }),
        prisma.trainer.findMany({ orderBy: { name: "asc" } }),
        prisma.vehicle.findMany({ orderBy: { registrationNumber: "asc" } })
    ]);

    if (!schedule) {
        notFound();
    }

    if (schedule.attended) {
        redirect("/schedule");
    }

    // Format for input fields
    const dateValue = schedule.date.toISOString().split('T')[0];
    const startTimeValue = schedule.startTime.toISOString().split('T')[1].substring(0, 5);
    const endTimeValue = schedule.endTime.toISOString().split('T')[1].substring(0, 5);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/schedule" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Calendar
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Edit3 size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Reschedule Session</h1>
                        <p className="text-muted">Modify date, time, or assigned staff for this session.</p>
                    </div>
                </div>
            </header>

            <EditScheduleForm 
                id={id}
                schedule={schedule}
                students={students}
                trainers={trainers}
                vehicles={vehicles}
                dateValue={dateValue}
                startTimeValue={startTimeValue}
                endTimeValue={endTimeValue}
            />
            
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
