import { UserCheck, Plus, CarFront, Users, MapPin, Edit } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TrainersPage() {
    const trainers = await prisma.trainer.findMany({
        include: {
            assignedVehicle: true,
            _count: {
                select: { students: { where: { status: "TRAINING" } } }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const totalStaff = trainers.length;
    const activeTrainingLoad = trainers.reduce((sum: number, t: any) => sum + t._count.students, 0);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <div style={{ position: "sticky", top: "0", zIndex: 30, background: "var(--bg-primary)", paddingTop: "1rem", paddingBottom: "1rem", margin: "-1rem -1rem 2rem -1rem", paddingLeft: "1rem", paddingRight: "1rem", borderBottom: "1px solid var(--border-color)" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Staff & Trainers</h1>
                        <p className="text-muted">Manage instructors, vehicle bounds, and active allocations.</p>
                    </div>
                    <Link href="/trainers/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Plus size={18} />
                        Add New Trainer
                    </Link>
                </header>
            </div>

            {/* Staff Overview */}
            <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap", position: "sticky", top: "6rem", zIndex: 20 }}>
                <div style={{ flex: 1, minWidth: "120px" }}>
                    <div className="text-muted" style={{ marginBottom: "0.5rem", fontWeight: 500 }}>Employed Trainers</div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <UserCheck size={28} color="var(--success)" /> {totalStaff}
                    </div>
                </div>
                <div style={{ width: "1px", background: "var(--border-color)" }}></div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                    <div className="text-muted" style={{ marginBottom: "0.5rem", fontWeight: 500 }}>Active Trainees (Live)</div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Users size={28} color="var(--accent-primary)" /> {activeTrainingLoad}
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
                {trainers.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                        No driving instructors found. Click 'Add New Trainer' to onboard staff.
                    </div>
                ) : (
                    trainers.map((t: any) => (
                        <div key={t.id} className="glass-card" style={{ padding: "1.5rem", borderTop: "4px solid var(--success)", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                    <div style={{ color: "var(--success)", padding: "0.75rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "var(--radius-md)" }}>
                                        <UserCheck size={32} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</h3>
                                        <span className="badge" style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{t.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                                    <MapPin size={16} color="var(--text-muted)" />
                                    <span className="text-muted">License:</span>
                                    <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{t.licenseNumber}</span>
                                    {t.experience ? <span className="badge badge-primary" style={{marginLeft: 'auto'}}>{t.experience} Yrs. Exp</span> : null}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                                    <CarFront size={16} color="var(--text-muted)" />
                                    <span className="text-muted">Default Vehicle:</span>
                                    <span style={{ fontWeight: 500, color: t.assignedVehicle ? "var(--text-primary)" : "var(--warning)" }}>
                                        {t.assignedVehicle ? `${t.assignedVehicle.registrationNumber} (${t.assignedVehicle.vehicleType})` : "Floating / None"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                                    <Users size={16} color="var(--text-muted)" />
                                    <span className="text-muted">Active Students:</span>
                                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                        {t._count.students} Learning
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                                <Link href={`/trainers/${t.id}/edit`} className="btn btn-secondary" style={{ flex: 1, padding: "0.5rem", fontSize: "0.875rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                                    <Edit size={16} /> Update Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
