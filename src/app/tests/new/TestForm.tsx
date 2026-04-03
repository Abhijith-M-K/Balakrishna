"use client";

import React, { useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";
import StudentSearchSelect from "@/components/ui/StudentSearchSelect";
import { scheduleTest } from "../actions";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

export default function TestForm({ students, vehicles }: { students: any[], vehicles: any[] }) {
    const { showLoading, hideLoading } = useLoading();
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        showLoading("Scheduling RTO test...");
        
        setTimeout(() => {
            startTransition(async () => {
                try {
                    await scheduleTest(formData);
                } catch (error: any) {
                    if (error.message?.includes("NEXT_REDIRECT")) {
                        toast.success("RTO test scheduled successfully!");
                        return;
                    }
                    console.error("Action error:", error);
                    toast.error(error.message || "Failed to schedule test. Please try again.");
                    hideLoading(true);
                }
            });
        }, 10);
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
            <section>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Test Details
                </h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <StudentSearchSelect 
                            students={students} 
                            name="studentId" 
                            label="Select Student"
                            required
                        />
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
                <button type="submit" className="btn btn-primary" disabled={isPending} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Scheduling...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Schedule RTO Test
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
