import {
    CarFront,
    Bike,
    Plus,
    AlertTriangle,
    FileText,
    Wrench,
    Edit
} from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/formatters";

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
    const vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" }
    });

    const totalFleet = vehicles.length;
    const lmvCount = vehicles.filter((v: any) => v.vehicleType === "LMV").length;
    const bikeCount = vehicles.filter((v: any) => v.vehicleType.includes("MCW")).length;
    
    // Check if dates are overdue for attention logic
    const now = new Date();
    const attentionCount = vehicles.filter((v: any) => {
        const isInsuranceExpired = v.insuranceExpiry && new Date(v.insuranceExpiry) < now;
        const isServiceDue = v.serviceReminder && new Date(v.serviceReminder) < now;
        return isInsuranceExpired || isServiceDue;
    }).length;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Vehicle Management</h1>
                    <p className="text-muted">Manage training vehicles, compliance, and service requests.</p>
                </div>
                <Link href="/vehicles/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Plus size={18} />
                    Add Vehicle
                </Link>
            </header>

            {/* Fleet Overview */}
            <div className="glass-card" style={{ 
                padding: "1.5rem", 
                marginBottom: "2rem", 
                display: "flex", 
                gap: "2rem", 
                flexWrap: "wrap",
                position: "sticky",
                top: "1rem",
                zIndex: 30
            }}>
                <div style={{ flex: 1, minWidth: "120px" }}>
                    <div className="text-muted" style={{ marginBottom: "0.5rem", fontWeight: 500 }}>Total Fleet</div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{totalFleet}</div>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                    <div className="text-muted" style={{ marginBottom: "0.5rem", fontWeight: 500 }}>Cars (LMV)</div>
                    <div style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CarFront size={24} color="var(--accent-primary)" /> {lmvCount}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                    <div className="text-muted" style={{ marginBottom: "0.5rem", fontWeight: 500 }}>Bikes (2W)</div>
                    <div style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Bike size={24} color="var(--warning)" /> {bikeCount}
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: "120px" }}>
                    <div className="text-muted" style={{ marginBottom: "0.5rem", fontWeight: 500 }}>Attention Needed</div>
                    <div style={{ fontSize: "2rem", fontWeight: 600, color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <AlertTriangle size={24} /> {attentionCount}
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
                {vehicles.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                        No vehicles found in fleet. Click 'Add Vehicle' to register your first car or bike.
                    </div>
                ) : (
                    vehicles.map((v: any) => (
                        <VehicleCard
                            key={v.id}
                            id={v.id}
                            type={v.vehicleType} 
                            name={`${v.vehicleType} Training Vehicle`} 
                            regNo={v.registrationNumber}
                            insurance={v.insuranceExpiry}
                            service={v.serviceReminder}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function VehicleCard({ id, type, name, regNo, insurance, service }: any) {
    const now = new Date();
    const isInsuranceExpired = insurance && new Date(insurance) < now;
    const isServiceDue = service && new Date(service) < now;
    const isError = isInsuranceExpired || isServiceDue;
    
    const icon = type.includes("MCW") ? <Bike size={40} /> : <CarFront size={40} />;

    return (
        <div className="glass-card" style={{ padding: "1.5rem", borderTop: isError ? "4px solid var(--danger)" : "4px solid var(--success)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ color: "var(--text-muted)", padding: "0.5rem", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)" }}>
                        {icon}
                    </div>
                    <div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>{name}</h3>
                        <span className="badge" style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{regNo}</span>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                    <span className={`badge ${type === 'LMV' ? 'badge-primary' : 'badge-warning'}`} style={{ border: `1px solid ${type === 'LMV' ? 'var(--accent-primary)' : 'var(--warning)'}`, background: 'transparent' }}>{type}</span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <FileText size={16} color="var(--text-muted)" />
                    <span className="text-muted">Insurance Expiry:</span>
                    <span style={{ fontWeight: 500, color: isInsuranceExpired ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {insurance ? formatDate(insurance) : "Not Tracked"} {isInsuranceExpired && <span>(Expired)</span>}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                    <Wrench size={16} color="var(--text-muted)" />
                    <span className="text-muted">Service Due:</span>
                    <span style={{ fontWeight: 500, color: isServiceDue ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {service ? formatDate(service) : "Not Tracked"} {isServiceDue && <span>(Due)</span>}
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                <Link href={`/vehicles/${id}/edit`} className="btn btn-secondary" style={{ flex: 1, padding: "0.5rem", fontSize: "0.875rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                    <Edit size={16} /> Edit Details
                </Link>
            </div>
        </div>
    );
}
