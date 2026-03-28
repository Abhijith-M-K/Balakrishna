import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { CalendarDays, Clock, FileBadge, UserCheck, CarFront, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import StudentDetailHeader from "./StudentDetailHeader";

import prisma from "@/lib/prisma";

export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    let student;
    try {
        student = await prisma.student.findUnique({
            where: { id },
            include: { 
                feePayments: { orderBy: { paymentDate: 'desc' } },
                classSchedules: { 
                    include: { trainer: true, vehicle: true },
                    orderBy: { date: 'desc' }
                },
                testSchedules: {
                    include: { vehicle: true },
                    orderBy: { testDate: 'desc' }
                }
            }
        });
    } catch (e) {
        return notFound();
    }

    if (!student) {
        return notFound();
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <StudentDetailHeader 
                id={student.id} 
                dbId={student.id} 
                name={student.name} 
                studentId={student.studentId} 
                status={student.status} 
            />

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section className="glass-card" style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Personal Information</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div>
                                <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Phone Number</div>
                                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{student.phoneNumber}</div>
                            </div>
                            <div>
                                <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>License Type</div>
                                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{student.licenseType}</div>
                            </div>
                            <div>
                                <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Date of Birth</div>
                                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{formatDate(student.dateOfBirth)}</div>
                            </div>
                            <div>
                                <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Aadhar Number</div>
                                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{student.idProofNumber || "Not provided"}</div>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <div className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Address</div>
                                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{student.address || "Not provided"}</div>
                            </div>
                        </div>
                    </section>
                    
                    <section className="glass-card" style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Training History</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {student.classSchedules.length > 0 ? (
                                student.classSchedules.map((cls: any) => (
                                    <div key={cls.id} style={{ 
                                        padding: "1rem", 
                                        background: "var(--bg-tertiary)", 
                                        borderRadius: "0.75rem",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            <div style={{ color: "var(--accent-primary)" }}>
                                                <CalendarDays size={18} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{formatDate(cls.date)}</div>
                                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{cls.trainer.name} • {cls.vehicle.registrationNumber}</div>
                                            </div>
                                        </div>
                                        <div style={{ 
                                            padding: "0.25rem 0.6rem", 
                                            borderRadius: "0.4rem", 
                                            fontSize: "0.75rem", 
                                            fontWeight: 700,
                                            background: cls.attended ? "rgba(16, 185, 129, 0.1)" : "rgba(0,0,0,0.05)",
                                            color: cls.attended ? "var(--success)" : "var(--text-muted)"
                                        }}>
                                            {cls.attended ? "COMPLETED" : "SCHEDULED"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "2rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                                    <p className="text-muted">No training sessions recorded.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="glass-card" style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>RTO Driving Tests</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {student.testSchedules.length > 0 ? (
                                student.testSchedules.map((test: any) => (
                                    <div key={test.id} style={{ 
                                        padding: "1rem", 
                                        background: "var(--bg-tertiary)", 
                                        borderRadius: "0.75rem",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderLeft: test.status === "PASSED" ? "4px solid var(--success)" : test.status === "FAILED" ? "4px solid var(--danger)" : "4px solid var(--accent-primary)"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            <div style={{ color: test.status === "PASSED" ? "var(--success)" : test.status === "FAILED" ? "var(--danger)" : "var(--accent-primary)" }}>
                                                <FileBadge size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{formatDate(test.testDate)}</div>
                                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{test.vehicle?.registrationNumber || "No vehicle assigned"}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.85rem", color: test.status === "PASSED" ? "var(--success)" : test.status === "FAILED" ? "var(--danger)" : "var(--text-muted)" }}>
                                            {test.status === "PASSED" && <CheckCircle2 size={16} />}
                                            {test.status === "FAILED" && <XCircle size={16} />}
                                            {test.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: "2rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                                    <p className="text-muted">No driving tests scheduled yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <section className="glass-card" style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Course Details</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ padding: "0.5rem", background: "rgba(0,0,0,0.05)", borderRadius: "0.5rem", color: "var(--accent-primary)" }}>
                                    <FileBadge size={18} />
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>Enrolled On</div>
                                    <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{formatDate(student.registrationDate)}</div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ padding: "0.5rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "0.5rem", color: "var(--success)" }}>
                                    <CheckCircle2 size={18} />
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>Training Sessions</div>
                                    <div style={{ fontWeight: 700, color: "var(--success)" }}>
                                        {student.classSchedules.filter((s: any) => s.attended).length} Completed
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ padding: "0.5rem", background: "rgba(99, 102, 241, 0.1)", borderRadius: "0.5rem", color: "var(--accent-primary)" }}>
                                    <span style={{ fontWeight: 800 }}>₹</span>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>Total Course Fee</div>
                                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.1rem" }}>₹{student.totalFee.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card" style={{ padding: "1.5rem" }}>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Fee Payments</h2>
                        {student.feePayments && student.feePayments.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {student.feePayments.map((payment: any) => (
                                    <div key={payment.id} style={{ padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                            <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>{payment.receiptNumber}</span>
                                            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{formatDate(payment.paymentDate)}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                                            <span className="text-muted">Paid: <span style={{ color: "var(--success)" }}>₹{payment.paidAmount}</span></span>
                                            <span style={{ fontWeight: 600, color: payment.balance > 0 ? "var(--warning)" : "var(--success)" }}>
                                                Bal: ₹{payment.balance}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: "1rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                                <p className="text-muted" style={{ fontSize: "0.875rem" }}>No fee payments recorded.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
