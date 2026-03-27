import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrainerForm from "../../TrainerForm";

export default async function EditTrainerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const [trainer, activeVehicles] = await Promise.all([
        prisma.trainer.findUnique({ where: { id } }),
        prisma.vehicle.findMany()
    ]);

    if (!trainer) {
        notFound();
    }

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
                        <h1 style={{ marginBottom: "0.25rem" }}>Update Trainer Details</h1>
                        <p className="text-muted">Modify contact and vehicle assignment logic.</p>
                    </div>
                </div>
            </header>

            <TrainerForm initialData={trainer} isEdit={true} id={id} activeVehicles={activeVehicles} />
            
            <style>{`.hover-color-primary:hover { color: var(--accent-primary) !important; transition: color 0.2s; }`}</style>
        </div>
    );
}
