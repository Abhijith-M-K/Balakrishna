import Link from "next/link";
import { Plus, Search, FilePlus, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import DownloadReceiptButton from "./DownloadReceiptButton";
import { formatDate } from "@/lib/formatters";

export const dynamic = 'force-dynamic';

export default async function AdditionalClassesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { q } = await searchParams;

    const where: any = {};
    if (q) {
        where.OR = [
            { receiptNumber: { contains: q, mode: 'insensitive' } },
            { student: { name: { contains: q, mode: 'insensitive' } } },
            { student: { studentId: { contains: q, mode: 'insensitive' } } }
        ];
    }

    const records = await prisma.additionalClass.findMany({
        where,
        include: { student: true },
        orderBy: { paymentDate: 'desc' }
    });

    return (
        <div className="animate-fade-in classes-page-container" style={{ 
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden" 
        }}>
            <style>{`
                .classes-page-container {
                    height: calc(100dvh - 3rem);
                }
                @media (max-width: 1023px) {
                    .classes-page-container {
                        height: calc(100dvh - 6rem);
                    }
                }
                .classes-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .classes-scroll-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .classes-scroll-area::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
            `}</style>
            
            <div style={{ flexShrink: 0 }}>
                <header style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.5rem" }}>Additional Classes</h1>
                        <p className="text-muted">Track payments and sessions for extra driving classes.</p>
                    </div>
                    <Link href="/additional-classes/new" className="btn btn-primary">
                        <Plus size={18} />
                        Record Additional Class
                    </Link>
                </header>

                <form method="GET" action="/additional-classes" className="glass-card" style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
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

            <div className="glass-card classes-scroll-area" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", marginBottom: "2rem" }}>
                <div style={{ overflowY: "auto", overflowX: "auto", width: "100%", flex: 1 }}>
                    <table style={{ minWidth: "800px", width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg-secondary, rgba(255,255,255,0.95))", backdropFilter: "blur(8px)" }}>
                            <tr style={{ borderBottom: "1px solid var(--border-color)", boxShadow: "0 1px 0 0 var(--border-color)" }}>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Receipt No.</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Student</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>License & Method</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Amount</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", textAlign: "right", background: "inherit" }}>Export</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                                        No additional class records found.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record: any) => (
                                    <tr key={record.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} className="hover-row">
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{record.receiptNumber}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{formatDate(record.paymentDate)}</div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "var(--accent-primary)" }}>
                                                    {record.student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{record.student.name}</div>
                                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{record.student.studentId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{record.licenseType}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{record.paymentMethod.replace('_', ' ')}</div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div style={{ fontWeight: 700, color: "var(--success)", fontSize: "1.1rem" }}>₹{record.amount}</div>
                                            {record.notes && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={record.notes}>{record.notes}</div>}
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <DownloadReceiptButton record={record} />
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
                .hover-row:hover { background: rgba(0,0,0,0.02); }
            `}</style>
        </div>
    );
}
