import Link from "next/link";
import { ArrowLeft, CarFront, Save } from "lucide-react";
import { addVehicle } from "../actions";

export const dynamic = 'force-dynamic';

export default function AddVehiclePage() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/vehicles" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Vehicles
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CarFront size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Register New Vehicle</h1>
                        <p className="text-muted">Add a new vehicle to your driving school fleet.</p>
                    </div>
                </div>
            </header>

            <form action={addVehicle} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
                
                <section>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Vehicle Specifications
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Registration Number <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="registrationNumber"
                                type="text" 
                                required
                                placeholder="e.g. KL 56 AB 1234"
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
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Vehicle Class <span style={{color: "var(--danger)"}}>*</span></label>
                            <select 
                                name="vehicleType"
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
                                <option value="" disabled>Select class...</option>
                                <option value="LMV">LMV (Car)</option>
                                <option value="MCWG">MCWG (Bike with gear)</option>
                                <option value="MCWOG">MCWOG (Scooter)</option>
                                <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Insurance Expiry Date</label>
                            <input 
                                name="insuranceExpiry"
                                type="date" 
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
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Service Reminder Date</label>
                            <input 
                                name="serviceReminder"
                                type="date" 
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
                    <Link href="/vehicles" className="btn btn-secondary">
                        Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Save size={18} />
                        Register Vehicle
                    </button>
                </div>
            </form>
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
