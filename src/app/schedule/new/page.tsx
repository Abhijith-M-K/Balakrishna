import Link from "next/link";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";
import prisma from "@/lib/prisma";
import { scheduleClass } from "../actions";

export const dynamic = 'force-dynamic';

export default async function ScheduleNewClassPage() {
    const [students, trainers, vehicles] = await Promise.all([
        prisma.student.findMany({
            where: { status: { in: ["ENROLLED", "TRAINING"] } },
            orderBy: { name: "asc" }
        }),
        prisma.trainer.findMany({
            orderBy: { name: "asc" }
        }),
        prisma.vehicle.findMany({
            orderBy: { registrationNumber: "asc" }
        })
    ]);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/schedule" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Calendar
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CalendarPlus size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Book Training Session</h1>
                        <p className="text-muted">Schedule a new practical driving class.</p>
                    </div>
                </div>
            </header>

            <form action={scheduleClass} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
                
                <section>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Session Participants
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Select Student <span style={{color: "var(--danger)"}}>*</span></label>
                            <select 
                                name="studentId"
                                required
                                defaultValue=""
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                    appearance: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="" disabled>Choose a student...</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                        {s.studentId} - {s.name} ({s.licenseType})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Assign Trainer <span style={{color: "var(--danger)"}}>*</span></label>
                                <select 
                                    name="trainerId"
                                    required
                                    defaultValue=""
                                    style={{
                                        padding: "0.75rem 1rem",
                                        background: "var(--bg-tertiary)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "var(--radius-md)",
                                        color: "var(--text-primary)",
                                        outline: "none",
                                        appearance: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    <option value="" disabled>Choose instructor...</option>
                                    {trainers.map((t: any) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} (Lic: {t.licenseNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Select Vehicle <span style={{color: "var(--danger)"}}>*</span></label>
                                <select 
                                    name="vehicleId"
                                    required
                                    defaultValue=""
                                    style={{
                                        padding: "0.75rem 1rem",
                                        background: "var(--bg-tertiary)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "var(--radius-md)",
                                        color: "var(--text-primary)",
                                        outline: "none",
                                        appearance: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    <option value="" disabled>Choose vehicle...</option>
                                    {vehicles.map((v: any) => (
                                        <option key={v.id} value={v.id}>
                                            {v.registrationNumber} ({v.vehicleType})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <div style={{ height: "1px", background: "var(--border-color)", marginTop: "1rem" }}></div>

                <section>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Time Tracking
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Session Date <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="date"
                                type="date"
                                required
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Start Time <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="startTime"
                                type="time"
                                required
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>End Time <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="endTime"
                                type="time"
                                required
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>
                    </div>
                </section>

                <div style={{ height: "1px", background: "var(--border-color)", marginTop: "1rem" }}></div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <Link href="/schedule" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Save size={18} />
                        Confirm Booking
                    </button>
                </div>
            </form>
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
