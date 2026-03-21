import { redirect, notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

import prisma from "@/lib/prisma";

async function updateStudent(formData: FormData) {
    "use server";
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const dateOfBirthStr = formData.get("dateOfBirth") as string;
    const idProofNumber = formData.get("idProofNumber") as string;
    const dateOfBirth = dateOfBirthStr ? new Date(dateOfBirthStr) : null;
    const totalFee = parseFloat(formData.get("totalFee") as string) || 0;
    const licenseType = formData.get("licenseType") as "LMV" | "MCWG" | "HMV";
    const status = formData.get("status") as "ENROLLED" | "TRAINING" | "TEST_SCHEDULED" | "COMPLETED";
    
    await prisma.student.update({
        where: { id },
        data: {
            name,
            phoneNumber,
            address,
            dateOfBirth,
            idProofNumber,
            totalFee,
            licenseType,
            status
        }
    });

    redirect(`/students/${id}`);
}

export default async function EditStudentPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    
    let student;
    try {
        student = await prisma.student.findUnique({
            where: { id }
        });
    } catch (e) {
        return notFound();
    }

    if (!student) {
        return notFound();
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href={`/students/${id}`} className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Edit Student: {student.name}</h1>
                    <p className="text-muted">Update applicant details and training status.</p>
                </div>
            </header>

            <div className="glass-card" style={{ maxWidth: "800px", padding: "2rem" }}>
                <form action={updateStudent} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Hidden field for ID */}
                    <input type="hidden" name="id" value={student.id} />
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Full Name <span style={{color: "var(--danger)"}}>*</span></label>
                            <input 
                                name="name"
                                type="text" 
                                required
                                defaultValue={student.name}
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
                                defaultValue={student.phoneNumber}
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
                            defaultValue={student.address || ""}
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
                                defaultValue={student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ""}
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
                                defaultValue={student.idProofNumber || ""}
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
                                defaultValue={student.licenseType}
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
                                defaultValue={student.totalFee}
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

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1", marginTop: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Student Status <span style={{color: "var(--danger)"}}>*</span></label>
                            <select 
                                name="status"
                                required
                                defaultValue={student.status}
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
                                <option value="ENROLLED">Enrolled</option>
                                <option value="TRAINING">Training</option>
                                <option value="TEST_SCHEDULED">Test Scheduled</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                        <Link href={`/students/${id}`} className="btn btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} /> Update Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
