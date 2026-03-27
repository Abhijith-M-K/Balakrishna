"use client";

import React from "react";
import { Save } from "lucide-react";
import Link from "next/link";
import { addStudentAction } from "../actions";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function StudentForm() {
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        showLoading("Registering student...");
        
        try {
            const result = await addStudentAction(formData);
            
            if (result?.error) {
                toast.error(result.error);
                hideLoading();
            } else {
                toast.success("Student registered successfully!");
                // Redirection is handled by the server action, 
                // but we show the toast just before it happens.
            }
        } catch (error: any) {
            if (error.message?.includes("NEXT_REDIRECT")) {
                toast.success("Student registered successfully!");
                return;
            }
            console.error("Add student client error:", error);
            toast.error(error.message || "Failed to register student. Please try again.");
            hideLoading();
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Full Name <span style={{color: "var(--danger)"}}>*</span></label>
                    <input 
                        name="name"
                        type="text" 
                        required
                        placeholder="e.g. Rahul Sharma"
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
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Phone Number <span style={{color: "var(--danger)"}}>*</span></label>
                    <input 
                        name="phoneNumber"
                        type="tel" 
                        required
                        placeholder="e.g. +91 9876543210"
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
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Address</label>
                <textarea 
                    name="address"
                    rows={3}
                    placeholder="Full residential address"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Date of Birth</label>
                    <input 
                        name="dateOfBirth"
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
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Aadhar Number (ID Proof)</label>
                    <input 
                        name="idProofNumber"
                        type="text" 
                        placeholder="e.g. 1234 5678 9012"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
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
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            cursor: "pointer"
                        }}
                    >
                        <option value="LMV">Light Motor Vehicle (LMV) - Car</option>
                        <option value="MCWG">Motor Cycle With Gear (MCWG) - Bike</option>
                        <option value="BOTH">Both LMV & MCWG</option>
                        <option value="HMV">Heavy Motor Vehicle (HMV) - Truck/Bus</option>
                    </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Total Course Fee (₹) <span style={{color: "var(--danger)"}}>*</span></label>
                    <input 
                        name="totalFee"
                        type="number" 
                        required
                        min="0"
                        placeholder="e.g. 5000"
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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                <Link href="/students" className="btn btn-secondary">
                    Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                    <Save size={18} /> Save Student
                </button>
            </div>
        </form>
    );
}
