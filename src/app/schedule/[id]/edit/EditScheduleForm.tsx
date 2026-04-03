"use client";

import React, { useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";
import StudentSearchSelect from "@/components/ui/StudentSearchSelect";
import { editSchedule } from "../../actions";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

interface EditScheduleFormProps {
    id: string;
    schedule: any;
    students: any[];
    trainers: any[];
    vehicles: any[];
    dateValue: string;
    startTimeValue: string;
    endTimeValue: string;
}

export default function EditScheduleForm({ 
    id, 
    schedule, 
    students, 
    trainers, 
    vehicles,
    dateValue,
    startTimeValue,
    endTimeValue
}: EditScheduleFormProps) {
    const { showLoading, hideLoading } = useLoading();
    const [isPending, startTransition] = useTransition();
    const editScheduleWithId = editSchedule.bind(null, id);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        showLoading("Updating session details...");
        
        setTimeout(() => {
            startTransition(async () => {
                try {
                    await editScheduleWithId(formData);
                } catch (error: any) {
                    if (error.message?.includes("NEXT_REDIRECT")) {
                        toast.success("Session rescheduled successfully!");
                        return;
                    }
                    console.error("Action error:", error);
                    toast.error(error.message || "Failed to update session. Please try again.");
                    hideLoading(true);
                }
            });
        }, 10);
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
            <section>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Session Participants
                </h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <StudentSearchSelect 
                            students={students} 
                            name="studentId" 
                            label="Select Student"
                            defaultValue={schedule.studentId}
                            required
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Assign Trainer <span style={{color: "var(--danger)"}}>*</span></label>
                            <select 
                                name="trainerId"
                                required
                                defaultValue={schedule.trainerId}
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
                                defaultValue={schedule.vehicleId}
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
                            defaultValue={dateValue}
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
                            defaultValue={startTimeValue}
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
                            defaultValue={endTimeValue}
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
                <button type="submit" className="btn btn-primary" disabled={isPending} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Update & Reschedule
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
