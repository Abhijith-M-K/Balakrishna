import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import {
    Users,
    Search,
    Filter,
    Plus,
    FileBadge
} from "lucide-react";

import prisma from "@/lib/prisma";
import StudentActions from "./StudentActions";
import DownloadStudentListButton from "./DownloadStudentListButton";
import DownloadStudentCardButton from "./DownloadStudentCardButton";
import StudentRow from "./StudentRowClient";

export const dynamic = 'force-dynamic';

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
        include: {
            _count: {
                select: {
                    classSchedules: {
                        where: { attended: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="animate-fade-in students-page-container" style={{ 
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden" 
        }}>
            <style>{`
                .students-page-container {
                    height: calc(100dvh - 3rem);
                }
                @media (max-width: 1023px) {
                    .students-page-container {
                        height: calc(100dvh - 6rem);
                    }
                }
                .students-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .students-scroll-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .students-scroll-area::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
            `}</style>
            
            <div style={{ flexShrink: 0 }}>
                <header className="page-header" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
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
                <form method="GET" action="/students" className="glass-card" style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
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
                            <option value="BOTH">Both (LMV & MCWG)</option>
                            <option value="HMV">HMV (Heavy)</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1rem" }}>
                        Apply Filters
                    </button>
                </form>
            </div>

            <div className="glass-card students-scroll-area" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", marginBottom: "2rem" }}>
                <div style={{ overflowY: "auto", overflowX: "auto", width: "100%", flex: 1 }}>
                    <table style={{ minWidth: "800px", width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg-secondary, rgba(255,255,255,0.95))", backdropFilter: "blur(8px)" }}>
                            <tr style={{ borderBottom: "1px solid var(--border-color)", boxShadow: "0 1px 0 0 var(--border-color)" }}>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Student</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>License</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Enroll Date</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Status</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Training</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", background: "inherit" }}>Total Fee</th>
                                <th style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem", textAlign: "right", background: "inherit" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
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
                                    trainingCount={student._count.classSchedules}
                                    totalFee={student.totalFee}
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
