import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import TrainerForm from "../TrainerForm";

export const dynamic = 'force-dynamic';

export default async function AddTrainerPage() {
    const activeVehicles = await prisma.vehicle.findMany();

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href="/trainers" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "1rem", textDecoration: "none" }} className="hover-color-primary">
                    <ArrowLeft size={16} />
                    Back to Staff
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Register New Trainer</h1>
                        <p className="text-muted">Onboard a new driving instructor into your management pool.</p>
                    </div>
                </div>
            </header>

            <TrainerForm activeVehicles={activeVehicles} />
            
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
