import { 
    ChevronLeft, 
    Users, 
    Wallet, 
    FileSpreadsheet, 
    BarChart3, 
    PieChart,
    MapPin,
    Phone,
    Globe
} from "lucide-react";
import Link from "next/link";
import { 
    getStudentReport, 
    getFeeCollectionReport, 
    getPendingPaymentReport, 
    getTestOutcomeReport,
    getTrainerPerformanceReport,
    getVehicleUsageReport,
    getMonthlyIncomeReport
} from "../actions";
import { formatDate } from "@/lib/formatters";
import PrintButton from "./PrintButton";
import DateFilter from "./DateFilter";

export default async function ReportDetail({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ type: string }>,
    searchParams: Promise<{ from?: string, to?: string }>
}) {
    const { type } = await params;
    const { from, to } = await searchParams;

    // Convert string dates to Date objects
    const startDate = from ? new Date(from) : undefined;
    const endDate = to ? new Date(to) : undefined;

    let rawData: any = [];
    let title = "";
    let icon = <BarChart3 />;
    let columns: string[] = [];
    let stats: any = null;

    switch (type) {
        case "students":
            rawData = await getStudentReport(startDate, endDate);
            title = "Student Enrollment Report";
            icon = <Users size={24} />;
            columns = ["Student ID", "Full Name", "Contact", "Reg Date", "Status", "Classes", "Tests"];
            break;
        case "fees":
            rawData = await getFeeCollectionReport(startDate, endDate);
            title = "Fee Collection Ledger";
            icon = <Wallet size={24} />;
            columns = ["Payment Date", "Student Name", "Amount Paid", "Method", "Receipt #"];
            break;
        case "pending":
            rawData = await getPendingPaymentReport(startDate, endDate);
            title = "Outstanding Dues Report";
            icon = <FileSpreadsheet size={24} />;
            columns = ["Student Name", "Contract Value", "Paid", "Balance Owed", "Phone"];
            stats = {
                title: "Total Outstanding Portfolio",
                value: `₹${rawData.reduce((sum: number, s: any) => sum + s.balance, 0).toLocaleString()}`
            };
            break;
        case "tests":
            const testData = await getTestOutcomeReport(startDate, endDate);
            rawData = testData.tests;
            title = "Examination Performance Report";
            icon = <FileSpreadsheet size={24} />;
            columns = ["Test Date", "Candidate Name", "License Type", "Result"];
            stats = {
                title: "Institutional Pass Rate",
                value: `${((testData.stats.passed / (testData.stats.passed + testData.stats.failed || 1)) * 100).toFixed(1)}%`
            };
            break;
        case "trainers":
            rawData = await getTrainerPerformanceReport(startDate, endDate);
            title = "Staff Productivity Audit";
            icon = <BarChart3 size={24} />;
            columns = ["Trainer Name", "Exp.", "Active Students", "Classes Delivered", "Success Rate"];
            break;
        case "vehicles":
            rawData = await getVehicleUsageReport(startDate, endDate);
            title = "Fleet Utilization Analysis";
            icon = <PieChart size={24} />;
            columns = ["Reg Number", "Fleet Type", "Training Hrs", "Testing Hrs", "Insurance Status"];
            break;
        case "monthly-income":
            rawData = await getMonthlyIncomeReport(startDate, endDate);
            title = "Monthly Financial Statement";
            icon = <BarChart3 size={24} color="#10b981" />;
            columns = ["Calendar Month", "Gross Revenue"];
            break;
        default:
            title = "Report Not Found";
    }

    // Prepare formatted data for Excel as it appears in the table
    const formattedData = rawData.map((item: any) => {
        if (type === "students") {
            return {
                "Student ID": item.studentId,
                "Full Name": item.name,
                "Contact": item.phoneNumber,
                "Reg Date": formatDate(item.registrationDate),
                "Status": item.status,
                "Classes": item._count.classSchedules,
                "Tests": item._count.testSchedules
            };
        }
        if (type === "fees") {
            return {
                "Payment Date": formatDate(item.paymentDate),
                "Student Name": item.student.name,
                "Amount Paid": item.paidAmount,
                "Method": item.paymentMethod,
                "Receipt #": item.receiptNumber
            };
        }
        if (type === "pending") {
            return {
                "Student Name": item.name,
                "Contract Value": item.totalFee,
                "Paid": item.totalPaid,
                "Balance Owed": item.balance,
                "Phone": item.phoneNumber
            };
        }
        if (type === "tests") {
            return {
                "Test Date": formatDate(item.testDate),
                "Candidate Name": item.student.name,
                "License Type": item.student.licenseType,
                "Result": item.status
            };
        }
        if (type === "trainers") {
            const totalTests = item.students.reduce((s: number, st: any) => s + st.testSchedules.length, 0);
            const passedTests = item.students.reduce((s: number, st: any) => s + st.testSchedules.filter((t: any) => t.status === 'PASSED').length, 0);
            const passRate = totalTests > 0 ? `${((passedTests / totalTests) * 100).toFixed(1)}%` : '0.0%';
            return {
                "Trainer Name": item.name,
                "Exp.": `${item.experience}Y`,
                "Active Students": item._count.students,
                "Classes Delivered": item._count.classSchedules,
                "Success Rate": passRate
            };
        }
        if (type === "vehicles") {
            return {
                "Reg Number": item.registrationNumber,
                "Fleet Type": item.vehicleType,
                "Training Hrs": item._count.classSchedules,
                "Testing Hrs": item._count.testSchedules,
                "Insurance Status": item.insuranceExpiry ? formatDate(item.insuranceExpiry) : 'PENDING'
            };
        }
        if (type === "monthly-income") {
            return {
                "Calendar Month": item.month,
                "Gross Revenue": item.total
            };
        }
        return item;
    });

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "3rem" }}>
            <div className="no-print" style={{ marginBottom: "1.5rem" }}>
                <Link href="/reports" style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    color: "var(--text-muted)", 
                    textDecoration: "none",
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                    fontWeight: 500
                }}>
                    <ChevronLeft size={16} /> Dashboard
                </Link>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ 
                            width: "48px", 
                            height: "48px", 
                            borderRadius: "12px", 
                            background: "rgba(91, 75, 223, 0.1)", 
                            color: "var(--accent-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {icon}
                        </div>
                        <div>
                            <h1 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 700 }}>{title}</h1>
                            <p className="text-muted" style={{ margin: 0 }}>
                                {from && to ? `Filtered: ${from} to ${to}` : "All Records Archive"}
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <PrintButton />
                    </div>
                </div>
            </div>

            <DateFilter />

            {/* Professional PDF Header */}
            <div className="print-only" style={{ display: "none", marginBottom: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #333", paddingBottom: "1.5rem" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", color: "#000", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>BALAKRISHNA</h1>
                        <p style={{ fontSize: "1rem", fontWeight: 600, color: "#444" }}>DRIVING SCHOOL ADMINISTRATION</p>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.85rem", color: "#666" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <MapPin size={12} /> Bangalore, Karnataka, India
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <Phone size={12} /> +91 98765 43210
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <Globe size={12} /> www.balakrishnadrivingschool.com
                        </div>
                    </div>
                </div>
                
                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h2 style={{ fontSize: "1.25rem", color: "#000", marginBottom: "0.25rem" }}>{title}</h2>
                        <p style={{ fontSize: "0.9rem", color: "#666" }}>
                            {from && to ? `Period: ${formatDate(new Date(from))} to ${formatDate(new Date(to))}` : "Full System Audit Record"}
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.9rem", color: "#000", fontWeight: 600 }}>Generated: {formatDate(new Date())}</p>
                        <p style={{ fontSize: "0.8rem", color: "#888" }}>Ref ID: BKDS-REP-{new Date().getTime().toString().slice(-6)}</p>
                    </div>
                </div>
            </div>

            {stats && (
                <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "inline-flex", flexDirection: "column", gap: "0.25rem", minWidth: "220px", border: "1px solid var(--accent-primary)", background: "rgba(91, 75, 223, 0.02)" }}>
                    <span className="text-muted" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent-primary)" }}>{stats.title}</span>
                    <span style={{ fontSize: "2rem", fontWeight: 800, color: "#000" }}>{stats.value}</span>
                </div>
            )}

            <div className="glass-card report-container" style={{ padding: "0.5rem", overflowX: "auto", border: "1px solid var(--border-color)", borderTop: "4px solid var(--accent-primary)" }}>
                <table className="report-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                            {columns.map(col => (
                                <th key={col} style={{ padding: "1.25rem 1rem", color: "#475569", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rawData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: "5rem", textAlign: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", color: "var(--text-muted)" }}>
                                        <FileSpreadsheet size={48} style={{ opacity: 0.1 }} />
                                        <p style={{ fontWeight: 600, fontSize: "1rem" }}>System Record Empty</p>
                                        <p style={{ fontSize: "0.85rem" }}>No entries were found matching this report criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rawData.map((item: any, idx: number) => (
                                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }} className="hover-report-row">
                                    {type === "students" && (
                                        <>
                                            <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#64748b" }}>{item.studentId}</td>
                                            <td style={{ padding: "1rem", fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{item.name}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#334155" }}>{item.phoneNumber}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#334155" }}>{formatDate(item.registrationDate)}</td>
                                            <td style={{ padding: "1rem" }}><span className="badge" style={{ fontSize: "0.7rem" }}>{item.status}</span></td>
                                            <td style={{ padding: "1rem", fontWeight: 600, color: "#5b4bdf" }}>{item._count.classSchedules}</td>
                                            <td style={{ padding: "1rem", fontWeight: 600, color: "#5b4bdf" }}>{item._count.testSchedules}</td>
                                        </>
                                    )}
                                    {type === "fees" && (
                                        <>
                                            <td style={{ padding: "1rem", fontSize: "0.85rem" }}>{formatDate(item.paymentDate)}</td>
                                            <td style={{ padding: "1rem", fontWeight: 700, color: "#0f172a" }}>{item.student.name}</td>
                                            <td style={{ padding: "1rem", color: "var(--success)", fontWeight: 800 }}>₹{item.paidAmount.toLocaleString()}</td>
                                            <td style={{ padding: "1rem" }}><span className="badge" style={{ background: "rgba(0,0,0,0.05)", color: "#000" }}>{item.paymentMethod}</span></td>
                                            <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#64748b", fontFamily: "monospace" }}>{item.receiptNumber}</td>
                                        </>
                                    )}
                                    {type === "pending" && (
                                        <>
                                            <td style={{ padding: "1rem", fontWeight: 700, color: "#0f172a" }}>{item.name}</td>
                                            <td style={{ padding: "1rem", color: "#64748b" }}>₹{item.totalFee.toLocaleString()}</td>
                                            <td style={{ padding: "1rem", color: "#10b981", fontWeight: 600 }}>₹{item.totalPaid.toLocaleString()}</td>
                                            <td style={{ padding: "1rem", color: "var(--danger)", fontWeight: 800 }}>₹{item.balance.toLocaleString()}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.85rem" }}>{item.phoneNumber}</td>
                                        </>
                                    )}
                                    {type === "tests" && (
                                        <>
                                            <td style={{ padding: "1rem", fontSize: "0.85rem" }}>{formatDate(item.testDate)}</td>
                                            <td style={{ padding: "1rem", fontWeight: 700, color: "#0f172a" }}>{item.student.name}</td>
                                            <td style={{ padding: "1rem" }}><span className="badge badge-accent" style={{ fontSize: "0.7rem", fontWeight: 800 }}>{item.student.licenseType}</span></td>
                                            <td style={{ padding: "1rem" }}>
                                                <span className={`badge ${item.status === 'PASSED' ? 'badge-success' : item.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`} style={{ fontWeight: 800, fontSize: "0.7rem" }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    {type === "trainers" && (
                                        <>
                                            <td style={{ padding: "1rem", fontWeight: 700, color: "#0f172a" }}>{item.name}</td>
                                            <td style={{ padding: "1rem", color: "#64748b" }}>{item.experience}Y</td>
                                            <td style={{ padding: "1rem", fontWeight: 600 }}>{item._count.students}</td>
                                            <td style={{ padding: "1rem", fontWeight: 600 }}>{item._count.classSchedules}</td>
                                            <td style={{ padding: "1rem", fontWeight: 800, color: "var(--accent-primary)" }}>
                                                {(() => {
                                                    const totalTests = item.students.reduce((s: number, st: any) => s + st.testSchedules.length, 0);
                                                    const passedTests = item.students.reduce((s: number, st: any) => s + st.testSchedules.filter((t: any) => t.status === 'PASSED').length, 0);
                                                    return totalTests > 0 ? `${((passedTests / totalTests) * 100).toFixed(1)}%` : '0.0%';
                                                })()}
                                            </td>
                                        </>
                                    )}
                                    {type === "vehicles" && (
                                        <>
                                            <td style={{ padding: "1rem", fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>{item.registrationNumber}</td>
                                            <td style={{ padding: "1rem", fontSize: "0.8rem" }}><span style={{ textTransform: "uppercase", fontWeight: 600, color: "#64748b" }}>{item.vehicleType}</span></td>
                                            <td style={{ padding: "1rem", fontWeight: 600 }}>{item._count.classSchedules}</td>
                                            <td style={{ padding: "1rem", fontWeight: 600 }}>{item._count.testSchedules}</td>
                                            <td style={{ padding: "1rem" }}>
                                                {item.insuranceExpiry && new Date(item.insuranceExpiry) < new Date() ? (
                                                    <span style={{ color: "var(--danger)", fontWeight: 700, fontSize: "0.8rem" }}>EXPIRED</span>
                                                ) : item.insuranceExpiry ? (
                                                    <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600 }}>{formatDate(item.insuranceExpiry)}</span>
                                                ) : 'PENDING'}
                                            </td>
                                        </>
                                    )}
                                    {type === "monthly-income" && (
                                        <>
                                            <td style={{ padding: "1rem", fontWeight: 600, color: "#0f172a" }}>{item.month}</td>
                                            <td style={{ padding: "1rem", color: "var(--success)", fontWeight: 900, fontSize: "1.25rem" }}>₹{item.total.toLocaleString()}</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer for PDF */}
            <div className="print-only" style={{ display: "none", marginTop: "3rem", borderTop: "1px solid #ddd", paddingTop: "1rem", fontSize: "0.75rem", color: "#888", textAlign: "center" }}>
                <p>This is a computer-generated document and does not require a physical signature for internal use.</p>
                <p>© {new Date().getFullYear()} Balakrishna Driving School. All Rights Reserved.</p>
            </div>
        </div>
    );
}
