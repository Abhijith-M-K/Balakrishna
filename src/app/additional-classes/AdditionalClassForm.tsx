"use client";

import React from "react";
import { Save } from "lucide-react";
import Link from "next/link";
import { addAdditionalClassAction } from "./actions";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import { Student } from "@prisma/client";

export function AdditionalClassForm({ students }: { students: Student[] }) {
    const { showLoading, hideLoading } = useLoading();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        showLoading("Recording additional class...");
        
        try {
            const result = await addAdditionalClassAction(formData);
            
            if (result?.error) {
                toast.error(result.error);
                hideLoading();
            } else {
                toast.success("Additional class recorded successfully!");
            }
        } catch (error: any) {
            if (error.message?.includes("NEXT_REDIRECT")) {
                toast.success("Additional class recorded successfully!");
                return;
            }
            console.error("Action error:", error);
            toast.error(error.message || "Failed to record. Please try again.");
            hideLoading();
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
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
                            cursor: "pointer"
                        }}
                    >
                        <option value="">-- Choose Student --</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name} ({student.studentId}) - {student.status}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>License Type <span style={{color: "var(--danger)"}}>*</span></label>
                    <select 
                        name="licenseType"
                        required
                        style={{
                            padding: "0.75rem 1rem",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--text-primary)",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        <option value="LMV">LMV (Car)</option>
                        <option value="MCWG">MCWG (Bike)</option>
                        <option value="BOTH">Both (LMV & MCWG)</option>
                        <option value="HMV">HMV (Heavy)</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Amount Paid (₹) <span style={{color: "var(--danger)"}}>*</span></label>
                    <input 
                        name="amount"
                        type="number" 
                        required
                        min="0"
                        placeholder="e.g. 500"
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
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Payment Method <span style={{color: "var(--danger)"}}>*</span></label>
                    <select 
                        name="paymentMethod"
                        required
                        style={{
                            padding: "0.75rem 1rem",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--text-primary)",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Additional Notes</label>
                <textarea 
                    name="notes"
                    rows={2}
                    placeholder="Brief description of the additional class/session"
                    style={{
                        padding: "0.75rem 1rem",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-primary)",
                        outline: "none",
                        resize: "vertical"
                    }}
                />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                <Link href="/additional-classes" className="btn btn-secondary">
                    Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                    <Save size={18} /> Record Class
                </button>
            </div>
        </form>
    );
}
