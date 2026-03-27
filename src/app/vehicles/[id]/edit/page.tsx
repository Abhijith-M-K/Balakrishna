import Link from "next/link";
import { ArrowLeft, CarFront } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import VehicleForm from "../../VehicleForm";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const vehicle = await prisma.vehicle.findUnique({
        where: { id }
    });

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/vehicles" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Vehicles
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CarFront size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Update Vehicle details</h1>
                        <p className="text-muted">Edit registration and compliance dates.</p>
                    </div>
                </div>
            </header>

            <VehicleForm initialData={vehicle} isEdit={true} id={id} />
            
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
