import Link from "next/link";
import { ArrowLeft, UserCheck, Save } from "lucide-react";
import prisma from "@/lib/prisma";
import { editTrainer } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditTrainerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const [trainer, activeVehicles] = await Promise.all([
        prisma.trainer.findUnique({ where: { id } }),
        prisma.vehicle.findMany()
    ]);

    if (!trainer) {
        notFound();
    }

    const updateTrainerWithId = editTrainer.bind(null, id);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/trainers" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Staff
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Update Trainer Details</h1>
                        <p className="text-muted">Modify contact and vehicle assignment logic.</p>
                    </div>
                </div>
            </header>

            <form action={updateTrainerWithId} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
                
                <section>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Personal & Professional Details
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Full Name <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="name"
                                type="text" 
                                required
                                defaultValue={trainer.name}
                                placeholder="e.g. Ramesh Kumar"
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Contact Number <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="phone"
                                type="tel" 
                                required
                                defaultValue={trainer.phone}
                                placeholder="e.g. 9876543210"
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Driver's License Number <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="licenseNumber"
                                type="text" 
                                required
                                defaultValue={trainer.licenseNumber}
                                placeholder="e.g. KL 56 20180001234"
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Experience (Years)</label>
                            <input 
                                name="experience"
                                type="number" 
                                min="0"
                                defaultValue={trainer.experience || ""}
                                placeholder="e.g. 5"
                                style={{
                                    padding: "0.75rem 1rem",
                                    background: "var(--bg-tertiary)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-md)",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Assign Training Vehicle</label>
                        <select 
                            name="assignedVehicleId"
                            defaultValue={trainer.assignedVehicleId || ""}
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
                            <option value="">No Vehicle Assigned (Floating)</option>
                            {activeVehicles.map((v: any) => (
                                <option key={v.id} value={v.id}>
                                    {v.registrationNumber} ({v.vehicleType})
                                </option>
                            ))}
                        </select>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>This vehicle will be set as the default resource for all students assigned to this trainer.</span>
                    </div>
                </section>

                <div style={{ height: "1px", background: "var(--border-color)", marginTop: "1rem" }}></div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <Link href="/trainers" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Save size={18} />
                        Update Trainer
                    </button>
                </div>
            </form>
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
