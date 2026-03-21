import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreVertical,
    CheckCircle2,
    Clock,
    CalendarDays,
    FileBadge
} from "lucide-react";

import prisma from "@/lib/prisma";
import StudentActions from "./StudentActions";
import DownloadStudentListButton from "./DownloadStudentListButton";
import DownloadStudentCardButton from "./DownloadStudentCardButton";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const { q, status, licenseType } = await searchParams;

    const where: any = {};
    
    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { studentId: { contains: q, mode: 'insensitive' } },
            { phoneNumber: { contains: q, mode: 'insensitive' } }
        ];
    }
    if (status) where.status = status;
    if (licenseType) where.licenseType = licenseType;

    const students = await prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Students List</h1>
                    <p className="text-muted">Manage all enrolled students, their training status, and details.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <DownloadStudentListButton students={students} />
                    <Link href="/students/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Plus size={18} />
                        Add Student
                    </Link>
                </div>
            </header>

            {/* Utilities Bar */}
            <form method="GET" action="/students" className="glass-card" style={{ padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        name="q"
                        defaultValue={q || ''}
                        type="text"
                        placeholder="Search by name, ID, or phone number..."
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
                
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Filter size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)", pointerEvents: "none" }} />
                    <select 
                        name="status" 
                        defaultValue={status || ''}
                        className="btn btn-secondary" 
                        style={{ paddingLeft: "2.5rem", WebkitAppearance: 'none', MozAppearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="">All Statuses</option>
                        <option value="ENROLLED">Enrolled</option>
                        <option value="TRAINING">Training</option>
                        <option value="TEST_SCHEDULED">Test Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <FileBadge size={18} style={{ position: "absolute", left: "1rem", color: "var(--text-muted)", pointerEvents: "none" }} />
                    <select 
                        name="licenseType" 
                        defaultValue={licenseType || ''}
                        className="btn btn-secondary" 
                        style={{ paddingLeft: "2.5rem", WebkitAppearance: 'none', MozAppearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="">All Licenses</option>
                        <option value="LMV">LMV (Car)</option>
                        <option value="MCWG">MCWG (Bike)</option>
                        <option value="HMV">HMV (Heavy)</option>
                    </select>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1rem" }}>
                    Apply Filters
                </button>
            </form>

            {/* Students Data Table */}
            <div className="glass-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", width: "100%" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg-secondary, rgba(255,255,255,0.95))", backdropFilter: "blur(8px)" }}>
                            <tr style={{ borderBottom: "1px solid var(--border-color)", boxShadow: "0 1px 0 0 var(--border-color)" }}>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Student</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>License</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Enroll Date</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Status</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", textAlign: "right", background: "inherit" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                                    No students found. Add your first student!
                                </td>
                            </tr>
                        ) : (
                            students.map((student: any) => (
                                <StudentRow
                                    key={student.id}
                                    student={student}
                                    dbId={student.id}
                                    id={student.studentId} 
                                    name={student.name} 
                                    phone={student.phoneNumber}
                                    licenseType={student.licenseType} 
                                    enrollDate={student.registrationDate} 
                                    status={student.status}
                                    avatar={student.name.charAt(0)} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

function StudentRow({ student, dbId, id, name, phone, licenseType, enrollDate, status, avatar }: any) {
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
                        <Link href={`/students/${dbId}`} style={{ fontWeight: 600, color: "var(--accent-primary)", display: "inline-block", marginBottom: "0.25rem" }}>
                            {name}
                        </Link>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem" }}>
                            <span>{id}</span> &bull; <span>{phone}</span>
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
