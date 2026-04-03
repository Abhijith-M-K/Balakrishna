import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Search, CheckCircle2, AlertCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import DownloadReceiptButton from "./DownloadReceiptButton";
import DeleteConfirmButton from "@/components/ui/DeleteConfirmButton";
import { deleteFeePayment } from "./actions";
import { formatDate } from "@/lib/formatters";

export const dynamic = 'force-dynamic';

export default async function FeesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { q } = await searchParams;

    const where: any = {};
    if (q) {
        where.OR = [
            { receiptNumber: { contains: q, mode: 'insensitive' } },
            { student: { name: { contains: q, mode: 'insensitive' } } },
            { student: { studentId: { contains: q, mode: 'insensitive' } } }
        ];
    }

    const payments = await prisma.feePayment.findMany({
        where,
        include: { student: true },
        orderBy: { paymentDate: 'desc' }
    });

    return (
        <div className="animate-fade-in fees-page-container" style={{ 
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden" 
        }}>
            <style>{`
                .fees-page-container {
                    height: calc(100dvh - 3rem);
                }
                @media (max-width: 1023px) {
                    .fees-page-container {
                        height: calc(100dvh - 6rem);
                    }
                }
                .fees-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .fees-scroll-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .fees-scroll-area::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
            `}</style>
            
            <div style={{ flexShrink: 0 }}>
                <header style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.5rem" }}>Fee Payments</h1>
                        <p className="text-muted">Track all incoming payments and balances across enrolled students.</p>
                    </div>
                    <Link href="/fees/new" className="btn btn-primary">
                        <Plus size={18} />
                        Record Payment
                    </Link>
                </header>

                <form method="GET" action="/fees" className="glass-card" style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
                        <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input
                            name="q"
                            defaultValue={q || ''}
                            type="text"
                            placeholder="Search by receipt or student name..."
                            style={{
                                width: "100%",
                                padding: "0.75rem 1rem 0.75rem 2.5rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none"
                            }}
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-secondary" style={{ padding: "0.75rem 1rem" }}>
                        Search Records
                    </button>
                </form>
            </div>

            <div className="glass-card fees-scroll-area" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", marginBottom: "2rem" }}>
                <div style={{ overflowY: "auto", overflowX: "auto", width: "100%", flex: 1 }}>
                    <table style={{ minWidth: "800px", width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg-secondary, rgba(255,255,255,0.95))", backdropFilter: "blur(8px)" }}>
                            <tr style={{ borderBottom: "1px solid var(--border-color)", boxShadow: "0 1px 0 0 var(--border-color)" }}>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Receipt No.</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Student</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Information</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Status</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", textAlign: "right", background: "inherit" }}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                                        No payments found. Record your first payment!
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment: any) => (
                                    <tr key={payment.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} className="hover-row">
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{payment.receiptNumber}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{formatDate(payment.paymentDate)}</div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "var(--text-primary)" }}>
                                                    {payment.student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={`/students/${payment.studentId}`} style={{ fontWeight: 600, color: "var(--accent-primary)", display: "inline-block", textDecoration: "none" }} className="hover-underline">
                                                        {payment.student.name}
                                                    </Link>
                                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{payment.student.studentId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}><span className="text-muted">Total: </span><span style={{ fontWeight: 500 }}>₹{payment.totalFee}</span></div>
                                            <div style={{ fontSize: "0.875rem" }}><span className="text-muted">Paid: </span><span style={{ fontWeight: 500, color: "var(--success)" }}>₹{payment.paidAmount}</span></div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>Method: <span style={{ fontWeight: 500 }}>{payment.paymentMethod.replace('_', ' ')}</span></div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            {payment.balance > 0 ? (
                                                <span className="badge badge-warning" style={{ background: "rgba(245, 158, 11, 0.1)", color: "#d97706" }}>
                                                    <AlertCircle size={12} style={{ marginRight: '4px' }} /> Balance: ₹{payment.balance}
                                                </span>
                                            ) : (
                                                <span className="badge badge-success">
                                                    <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Fully Paid
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                                <DownloadReceiptButton payment={payment} />
                                                <DeleteConfirmButton 
                                                    id={payment.id} 
                                                    entityName="Payment"
                                                    action={deleteFeePayment}
                                                    confirmMessage={`Are you sure you want to delete the payment of ₹${payment.paidAmount} for ${payment.student.name}?`}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`
                .hover-row:hover { background: rgba(255,255,255,0.02); }
                .hover-underline:hover { text-decoration: underline !important; }
            `}</style>
        </div>
    );
}
