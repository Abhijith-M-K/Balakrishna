"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import { addVehicle, editVehicle } from "./actions";
import { useRouter } from "next/navigation";

interface VehicleFormProps {
    initialData?: any;
    isEdit?: boolean;
    id?: string;
}

export default function VehicleForm({ initialData, isEdit, id }: VehicleFormProps) {
    const { showLoading, hideLoading } = useLoading();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        setIsSubmitting(true);
        showLoading(isEdit ? "Updating vehicle details..." : "Registering new vehicle...");

        try {
            if (isEdit && id) {
                const result = await editVehicle(id, formData);
                if (result.success) {
                    toast.success("Vehicle updated successfully");
                    router.push("/vehicles");
                }
            } else {
                const result = await addVehicle(formData);
                if (result.success) {
                    toast.success("Vehicle registered successfully");
                    router.push("/vehicles");
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
                    Vehicle Specifications
                </h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Registration Number <span style={{color: "var(--danger)"}}>*</span></label>
                        <input 
                            name="registrationNumber"
                            type="text" 
                            required
                            defaultValue={initialData?.registrationNumber || ""}
                            placeholder="e.g. KL 56 AB 1234"
                            className="input-field"
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
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Vehicle Class <span style={{color: "var(--danger)"}}>*</span></label>
                        <select 
                            name="vehicleType"
                            required
                            defaultValue={initialData?.vehicleType || ""}
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
                            <option value="" disabled>Select class...</option>
                            <option value="LMV">LMV (Car)</option>
                            <option value="MCWG">MCWG (Bike with gear)</option>
                            <option value="MCWOG">MCWOG (Scooter)</option>
                            <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Insurance Expiry</label>
                        <input 
                            name="insuranceExpiry"
                            type="date" 
                            defaultValue={initialData?.insuranceExpiry ? new Date(initialData.insuranceExpiry).toISOString().split('T')[0] : ""}
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none",
                                fontFamily: "inherit"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Pollution Expiry</label>
                        <input 
                            name="pollutionExpiry"
                            type="date" 
                            defaultValue={initialData?.pollutionExpiry ? new Date(initialData.pollutionExpiry).toISOString().split('T')[0] : ""}
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none",
                                fontFamily: "inherit"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Service Reminder</label>
                        <input 
                            name="serviceReminder"
                            type="date" 
                            defaultValue={initialData?.serviceReminder ? new Date(initialData.serviceReminder).toISOString().split('T')[0] : ""}
                            style={{
                                padding: "0.75rem 1rem",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-primary)",
                                outline: "none",
                                fontFamily: "inherit"
                            }}
                        />
                    </div>
                </div>
            </section>

            <div style={{ height: "1px", background: "var(--border-color)", marginTop: "1rem" }}></div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <Link href="/vehicles" className="btn btn-secondary">
                    Cancel
                </Link>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Save size={18} />
                    {isEdit ? "Update Details" : "Register Vehicle"}
                </button>
            </div>
        </form>
    );
}
