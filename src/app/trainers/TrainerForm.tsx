"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import { addTrainer, editTrainer } from "./actions";
import { useRouter } from "next/navigation";

interface TrainerFormProps {
    initialData?: any;
    isEdit?: boolean;
    id?: string;
    activeVehicles: any[];
}

export default function TrainerForm({ initialData, isEdit, id, activeVehicles }: TrainerFormProps) {
    const { showLoading, hideLoading } = useLoading();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        setIsSubmitting(true);
        showLoading(isEdit ? "Updating trainer details..." : "Registering new trainer...");

        try {
            if (isEdit && id) {
                const result = await editTrainer(id, formData);
                if (result.success) {
                    toast.success("Trainer updated successfully");
                    router.push("/trainers");
                }
            } else {
                const result = await addTrainer(formData);
                if (result.success) {
                    toast.success("Trainer registered successfully");
                    router.push("/trainers");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            setIsSubmitting(false);
            hideLoading();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
            <section>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    Personal & Professional Details
                </h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Full Name <span style={{color: "var(--danger)"}}>*</span></label>
                        <input 
                            name="name"
                            type="text" 
                            required
                            defaultValue={initialData?.name || ""}
                            placeholder="e.g. Ramesh Kumar"
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Contact Number <span style={{color: "var(--danger)"}}>*</span></label>
                        <input 
                            name="phone"
                            type="tel" 
                            required
                            defaultValue={initialData?.phone || ""}
                            placeholder="e.g. 9876543210"
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none"
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Driver's License Number <span style={{color: "var(--danger)"}}>*</span></label>
                        <input 
                            name="licenseNumber"
                            type="text" 
                            required
                            defaultValue={initialData?.licenseNumber || ""}
                            placeholder="e.g. KL 56 20180001234"
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Experience (Years)</label>
                        <input 
                            name="experience"
                            type="number" 
                            min="0"
                            defaultValue={initialData?.experience || ""}
                            placeholder="e.g. 5"
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none",
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Assign Training Vehicle</label>
                    <select 
                        name="assignedVehicleId"
                        defaultValue={initialData?.assignedVehicleId || ""}
                        style={{
                            padding: "0.75rem 1rem",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--text-primary)",
                            outline: "none",
                            appearance: "none",
                            cursor: "pointer"
                        }}
                    >
                        <option value="">No Vehicle Assigned (Floating)</option>
                        {activeVehicles.map((v: any) => (
                            <option key={v.id} value={v.id}>
                                {v.registrationNumber} ({v.vehicleType})
                            </option>
                        ))}
                    </select>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>This vehicle will be set as the default resource for all students assigned to this trainer.</span>
                </div>
            </section>

            <div style={{ height: "1px", background: "var(--border-color)", marginTop: "1rem" }}></div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <Link href="/trainers" className="btn btn-secondary">
                    Cancel
                </Link>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Save size={18} />
                    {isEdit ? "Update Details" : "Register Trainer"}
                </button>
            </div>
        </form>
    );
}
