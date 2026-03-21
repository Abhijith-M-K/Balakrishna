import Link from "next/link";
import { ArrowLeft, FileBadge, Save } from "lucide-react";
import prisma from "@/lib/prisma";
import { scheduleTest } from "../actions";

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

            <form action={scheduleTest} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
                <section>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Test Details
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Select Student <span style={{color: "var(--danger)"}}>*</span></label>
                            <select 
                                name="studentId"
                                required
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
                                <option value="">-- Select Student --</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                        {s.studentId} - {s.name} ({s.licenseType})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Assigned Vehicle (Optional)</label>
                                <select 
                                    name="vehicleId"
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
                                    <option value="">-- No specific vehicle --</option>
                                    {vehicles.map((v: any) => (
                                        <option key={v.id} value={v.id}>
                                            {v.registrationNumber} ({v.vehicleType})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Test Date <span style={{color: "var(--danger)"}}>*</span></label>
                                <input 
                                    name="testDate"
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
                        </div>
                    </div>
                </section>

                <div style={{ height: "1px", background: "var(--border-color)", marginTop: "1rem" }}></div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <Link href="/tests" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Save size={18} />
                        Schedule RTO Test
                    </button>
                </div>
            </form>
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
