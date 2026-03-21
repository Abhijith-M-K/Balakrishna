import {
    BarChart3,
    Download,
    FileSpreadsheet,
    PieChart,
    Users,
    Wallet
} from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 style={{ marginBottom: "0.5rem" }}>Analytics & Reports</h1>
                    <p className="text-muted">Generate comprehensive reports for management insights.</p>
                </div>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <ReportCard
                    title="Student Report"
                    type="students"
                    desc="List of all enrolled, training, and completed students with demographic data."
                    icon={<Users size={32} color="var(--accent-primary)" />}
                />
                <ReportCard
                    title="Fee Collection Report"
                    type="fees"
                    desc="Detailed breakdown of payments received, payment methods, and daily collection."
                    icon={<Wallet size={32} color="var(--success)" />}
                />
                <ReportCard
                    title="Pending Payment Report"
                    type="pending"
                    desc="List of students with outstanding balances, overdue alerts, and total pending amount."
                    icon={<FileSpreadsheet size={32} color="var(--warning)" />}
                />
                <ReportCard
                    title="Test Outcome Report"
                    type="tests"
                    desc="Pass/Fail rates, student performance metrics, and RTO test history overview."
                    icon={<FileSpreadsheet size={32} color="#ec4899" />}
                />
                <ReportCard
                    title="Trainer Performance"
                    type="trainers"
                    desc="Metrics on classes conducted, student pass rates, and assigned vehicles."
                    icon={<BarChart3 size={32} color="#8b5cf6" />}
                />
                <ReportCard
                    title="Vehicle Usage Report"
                    type="vehicles"
                    desc="Fleet utilization, class logs per vehicle, and service status tracking."
                    icon={<PieChart size={32} color="var(--danger)" />}
                />
            </div>

        </div>
    );
}

function ReportCard({ title, desc, icon, type }: any) {
    return (
        <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <div style={{ padding: "0.75rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                    {icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>{title}</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", flex: 1, lineHeight: 1.6 }}>{desc}</p>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <Link href={`/reports/${type}`} className="btn btn-primary" style={{ flex: 1, padding: "0.5rem", fontSize: "0.875rem", textAlign: "center", textDecoration: "none" }}>
                    Generate
                </Link>
            </div>
        </div>
    );
}
