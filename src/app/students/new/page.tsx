import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

import prisma from "@/lib/prisma";

async function addStudent(formData: FormData) {
    "use server";
    
    // We only create basic student fields in this form
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const dateOfBirthStr = formData.get("dateOfBirth") as string;
    const idProofNumber = formData.get("idProofNumber") as string;
    const dateOfBirth = dateOfBirthStr ? new Date(dateOfBirthStr) : null;
    const totalFee = parseFloat(formData.get("totalFee") as string) || 0;
    const licenseType = formData.get("licenseType") as "LMV" | "MCWG" | "HMV";
    
    // Simple id generator for studentId
    const studentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;

    await prisma.student.create({
        data: {
            studentId,
            name,
            phoneNumber,
            address,
            dateOfBirth,
            idProofNumber,
            totalFee,
            licenseType,
            status: "ENROLLED"
        }
    });

    redirect("/students");
}

export default function AddStudentPage() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/students" className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Add New Student</h1>
                    <p className="text-muted">Register a new applicant into the driving school system.</p>
                </div>
            </header>

            <div className="glass-card" style={{ maxWidth: "800px", padding: "2rem" }}>
                <form action={addStudent} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
            </div>
        </div>
    );
}
