"use client";

import Link from "next/link";
import { Clock, CalendarDays, CheckCircle2 } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import DownloadStudentCardButton from "./DownloadStudentCardButton";
import StudentActions from "./StudentActions";

export default function StudentRow({ student, dbId, id, name, phone, licenseType, enrollDate, status, avatar, trainingCount, totalFee }: any) {
    const { showLoading } = useLoading();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'TRAINING': return <span className="badge badge-accent"><Clock size={12} style={{ marginRight: '4px' }} /> Training</span>;
            case 'ENROLLED': return <span className="badge badge-warning">Enrolled</span>;
            case 'TEST_SCHEDULED': return <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}><CalendarDays size={12} style={{ marginRight: '4px' }} /> Test Scheduled</span>;
            case 'COMPLETED': return <span className="badge badge-success"><CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Completed</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    const formattedEnrollDate = enrollDate ? new Date(enrollDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : 'N/A';

    return (
        <tr style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} className="hover-row">
            <td style={{ padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: "var(--bg-tertiary)", display: "flex",
                        alignItems: "center", justifyContent: "center", fontWeight: 600, color: "var(--text-primary)"
                    }}>
                        {avatar}
                    </div>
                    <div>
                        <Link 
                            href={`/students/${dbId}`} 
                            onClick={() => showLoading()}
                            style={{ fontWeight: 600, color: "var(--accent-primary)", display: "inline-block", marginBottom: "0.25rem" }}
                        >
                            {name}
                        </Link>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 600, color: "var(--text-secondary)", flexShrink: 0 }}>ID: {id}</span> &bull; <span style={{ flexShrink: 0 }}>{phone}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td style={{ padding: "1rem 1.5rem" }}>
                <span style={{ fontWeight: 500 }}>{licenseType}</span>
            </td>
            <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {formattedEnrollDate}
            </td>
            <td style={{ padding: "1rem 1.5rem" }}>
                {getStatusBadge(status)}
            </td>
            <td style={{ padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "8px", 
                        background: "rgba(16, 185, 129, 0.1)", 
                        color: "var(--success)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.85rem"
                    }}>
                        {trainingCount}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>Sessions</span>
                </div>
            </td>
            <td style={{ padding: "1rem 1.5rem" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{totalFee.toLocaleString()}</span>
            </td>
            <td style={{ padding: "1rem 1.5rem", textAlign: "right", whiteSpace: "nowrap" }}>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <DownloadStudentCardButton student={student} />
                    <StudentActions id={dbId} />
                </div>
            </td>
            <style>{`
        .hover-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>
        </tr>
    );
}
