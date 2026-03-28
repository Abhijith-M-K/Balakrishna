import {
    CalendarDays,
    Plus,
    Clock,
    User,
    CarFront,
    Phone,
    CheckCircle,
    XCircle,
    FileBadge,
    Filter,
    X
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/formatters";
import Link from "next/link";
import TestResultButtons from "./TestResultButtons";

export default async function TestsPage({ searchParams }: { searchParams: Promise<{ status?: string, date?: string }> }) {
    const { status: filterStatus, date: filterDate } = await searchParams;

    const where: any = {};
    if (filterStatus === "passed") where.status = "PASSED";
    else if (filterStatus === "failed") where.status = "FAILED";
    else where.status = "PENDING";

    if (filterDate) {
        const startOfDay = new Date(filterDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filterDate);
        endOfDay.setHours(23, 59, 59, 999);

        where.testDate = {
            gte: startOfDay,
            lte: endOfDay
        };
    }

    const tests = await prisma.testSchedule.findMany({
        where,
        include: {
            student: true,
            vehicle: true
        },
        orderBy: {
            testDate: "desc"
        }
    });

    // Grouping tests by date
    const groupedTests = tests.reduce((groups: any, test: any) => {
        const dateKey = test.testDate.toISOString().split('T')[0];
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(test);
        return groups;
    }, {});

    const getStatusQuery = (status: string | null) => {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (filterDate) params.set('date', filterDate);
        return params.toString() ? `?${params.toString()}` : '/tests';
    };

    return (
        <div className="animate-fade-in tests-page-container" style={{ 
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden" 
        }}>
            <style>{`
                .tests-page-container {
                    height: calc(100dvh - 3rem);
                }
                @media (max-width: 1023px) {
                    .tests-page-container {
                        height: calc(100dvh - 6rem);
                    }
                }
                .tests-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }
                .tests-scroll-area::-webkit-scrollbar-track {
                    background: transparent;
                }
                .tests-scroll-area::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 10px;
                }
            `}</style>
            
            <div style={{ flexShrink: 0 }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Driving Test Management</h1>
                        <p className="text-muted">Schedule RTO tests, assign vehicles, and log results.</p>
                    </div>
                    <Link href="/tests/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Plus size={18} />
                        Schedule Test
                    </Link>
                </header>

                {/* Filter Bar */}
                <form method="GET" action="/tests" className="glass-card" style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input type="hidden" name="status" value={filterStatus || 'pending'} />
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                        <Filter size={18} />
                        <span>Filter by Date:</span>
                    </div>
                    <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
                        <input
                            name="date"
                            type="date"
                            defaultValue={filterDate || ''}
                            style={{
                                width: "100%",
                                padding: "0.6rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none",
                                fontFamily: "inherit"
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
                        Apply Filter
                    </button>
                    {filterDate && (
                        <Link href={`/tests${filterStatus ? `?status=${filterStatus}` : ''}`} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem" }}>
                            <X size={16} />
                            Clear
                        </Link>
                    )}
                </form>
            </div>

            <div className="tests-scroll-area" style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem", paddingBottom: "2rem" }}>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                <Link 
                    href={getStatusQuery(null)} 
                    style={{ 
                        textDecoration: "none",
                        color: !filterStatus || filterStatus === 'pending' ? "var(--accent-primary)" : "var(--text-muted)", 
                        fontWeight: 600, 
                        borderBottom: !filterStatus || filterStatus === 'pending' ? "2px solid var(--accent-primary)" : "2px solid transparent", 
                        paddingBottom: "1rem", 
                        marginBottom: "-0.6rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}
                >
                    <Clock size={18} /> Upcoming Tests
                </Link>
                <Link 
                    href={getStatusQuery('passed')} 
                    style={{ 
                        textDecoration: "none",
                        color: filterStatus === "passed" ? "var(--success)" : "var(--text-muted)", 
                        fontWeight: 600, 
                        borderBottom: filterStatus === "passed" ? "2px solid var(--success)" : "2px solid transparent", 
                        paddingBottom: "1rem", 
                        marginBottom: "-0.6rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}
                >
                    <CheckCircle size={18} /> Passed History
                </Link>
                <Link 
                    href={getStatusQuery('failed')} 
                    style={{ 
                        textDecoration: "none",
                        color: filterStatus === "failed" ? "var(--danger)" : "var(--text-muted)", 
                        fontWeight: 600, 
                        borderBottom: filterStatus === "failed" ? "2px solid var(--danger)" : "2px solid transparent", 
                        paddingBottom: "1rem", 
                        marginBottom: "-0.6rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}
                >
                    <XCircle size={18} /> Failed / Retests
                </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {tests.length === 0 ? (
                    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                        <FileBadge size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                        <h3>{filterDate ? "No tests on this date" : "No records found"}</h3>
                        <p>{filterDate ? "Try selecting another date or clear the filter." : "There are no driving tests currently matching this status."}</p>
                    </div>
                ) : (
                    Object.keys(groupedTests).map((dateKey) => (
                        <div key={dateKey}>
                            <h3 style={{ 
                                fontSize: "1.1rem", 
                                color: "var(--text-muted)", 
                                marginBottom: "1rem", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "0.75rem",
                                fontWeight: 600
                            }}>
                                <CalendarDays size={18} /> 
                                {formatDate(new Date(dateKey))}
                            </h3>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {groupedTests[dateKey].map((test: any) => (
                                    <div key={test.id} className="glass-card" style={{ padding: "1.25rem", display: "flex", gap: "1.5rem", alignItems: "center", position: "relative", overflow: "hidden", flexWrap: "wrap" }}>
                                        
                                        {/* Status Sidebar */}
                                        <div style={{ 
                                            position: "absolute", 
                                            left: "0", 
                                            top: "0", 
                                            bottom: "0", 
                                            width: "4px", 
                                            background: test.status === "PASSED" ? "var(--success)" : test.status === "FAILED" ? "var(--danger)" : "var(--accent-primary)"
                                        }} />

                                        <div style={{
                                            width: "56px", height: "56px", borderRadius: "12px",
                                            background: "rgba(59, 130, 246, 0.1)", display: "flex",
                                            alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--accent-primary)", fontSize: "1.25rem",
                                            flexShrink: 0
                                        }}>
                                            {test.student.name.charAt(0)}
                                        </div>

                                        <div style={{ flex: "1 1 200px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.35rem" }}>
                                                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>{test.student.name}</h3>
                                                <span className="badge">{test.student.licenseType}</span>
                                            </div>
                                            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Phone size={14} /> {test.student.phoneNumber}</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><CarFront size={14} /> {test.vehicle?.registrationNumber || 'No vehicle assigned'}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                                            <TestResultButtons id={test.id} currentStatus={test.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);
}
