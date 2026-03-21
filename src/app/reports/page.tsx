import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
    Users, 
    Wallet, 
    TrendingUp, 
    CarFront, 
    BarChart3, 
    PieChart,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    // Basic stats for report overview
    const studentCount = await prisma.student.count();
    const trainerCount = await prisma.trainer.count();
    const vehicleCount = await prisma.vehicle.count();
    
    // Recent income calculation
    const recentPayments = await prisma.feePayment.findMany({
        take: 20,
        orderBy: { paymentDate: 'desc' }
    });
    const monthlyTotal = recentPayments.reduce((sum: number, p: any) => sum + p.paidAmount, 0);

    const reports = [
        {
            title: "Students Enrollment",
            description: "Detailed list of all students with enrollment dates and status.",
            icon: <Users />,
            id: "students",
            color: "#3b82f6"
        },
        {
            title: "Fee Collections",
            description: "Ledger of all payments received with receipt numbers and methods.",
            icon: <Wallet />,
            id: "fees",
            color: "#10b981"
        },
        {
            title: "Pending Payments",
            description: "Identifies students with outstanding balances and total dues.",
            icon: <TrendingUp />,
            id: "pending",
            color: "#f59e0b"
        },
        {
            title: "Test Outcomes",
            description: "Analysis of driving test results, pass/fail rates and candidates.",
            icon: <PieChart />,
            id: "tests",
            color: "#ef4444"
        },
        {
            title: "Staff Performance",
            description: "Trainer metrics, active students per trainer, and success rates.",
            icon: <BarChart3 />,
            id: "trainers",
            color: "#8b5cf6"
        },
        {
            title: "Fleet Utilization",
            description: "Vehicle usage statistics and maintenance/insurance tracking.",
            icon: <CarFront />,
            id: "vehicles",
            color: "#6366f1"
        },
        {
            title: "Monthly Revenue",
            description: "Financial breakdown of income across different months.",
            icon: <TrendingUp />,
            id: "monthly-income",
            color: "#059669"
        }
    ];

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "3rem" }}>
            <header style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ marginBottom: "0.5rem" }}>Intelligence & Reports</h1>
                <p className="text-muted">Export data, analyze performance, and audit financial records.</p>
            </header>

            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                gap: "1.5rem",
                marginBottom: "3rem"
            }}>
                <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Total Enrollment</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{studentCount}</span>
                </div>
                <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Active Fleet</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{vehicleCount}</span>
                </div>
                <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Recent Collections</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#10b981" }}>₹{monthlyTotal.toLocaleString()}</span>
                </div>
            </div>

            <h2 style={{ fontSize: "1.1rem", marginBottom: "1.5rem", fontWeight: 700, color: "var(--text-secondary)" }}>Available Report Categories</h2>
            
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
                gap: "1.25rem" 
            }}>
                {reports.map((report) => (
                    <Link key={report.id} href={`/reports/${report.id}`} style={{ textDecoration: "none" }}>
                        <div className="glass-card hover-lift" style={{ 
                            padding: "1.5rem", 
                            display: "flex", 
                            flexDirection: "column", 
                            height: "100%", 
                            borderLeft: `4px solid ${report.color}`,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                <div style={{ 
                                    width: "40px", 
                                    height: "40px", 
                                    borderRadius: "10px", 
                                    background: `${report.color}15`, 
                                    color: report.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    {report.icon}
                                </div>
                                <ArrowUpRight size={18} color="var(--text-muted)" />
                            </div>
                            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{report.title}</h3>
                            <p className="text-muted" style={{ fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>{report.description}</p>
                            
                            <div style={{ marginTop: "auto", paddingTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: report.color }}>
                                GENERATE MODULE <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style>{`
                .hover-lift:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
                    border-color: transparent;
                }
            `}</style>
        </div>
    );
}
