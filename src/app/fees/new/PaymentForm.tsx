"use client";

import { useState, useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import StudentSearchSelect from "@/components/ui/StudentSearchSelect";
import { addFeePayment } from "../actions";

export default function PaymentForm({ students }: { students: any[] }) {
    const { showLoading, hideLoading } = useLoading();
    const [isPending, startTransition] = useTransition();
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [paidAmount, setPaidAmount] = useState<number | "">("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        // Show loading immediately
        showLoading("Recording payment...");
        
        // Small timeout to ensure the UI has updated before starting the transition
        // This is a common pattern to fix 'missing' loader issues caused by batching
        setTimeout(() => {
            startTransition(async () => {
                try {
                    await addFeePayment(formData);
                } catch (error: any) {
                    if (error.message?.includes("NEXT_REDIRECT")) {
                        toast.success("Payment recorded successfully!");
                        return;
                    }
                    console.error("Action error:", error);
                    toast.error(error.message || "Failed to record payment. Please try again.");
                    hideLoading(true); // Force hide on real error
                }
            });
        }, 10);
    }

    const remainingBalance = selectedStudent ? selectedStudent.balance : 0;
    const newBalance = selectedStudent ? (remainingBalance - (Number(paidAmount) || 0)) : 0;

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <StudentSearchSelect 
                students={students} 
                name="studentId" 
                label="Select Enrolled Student"
                required
                onSelect={(s) => setSelectedStudent(s)}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Total Course Fee (₹)</label>
                    <input 
                        type="text" 
                        readOnly
                        value={selectedStudent ? `₹${selectedStudent.totalFee}` : "Select a student..."} 
                        style={{ padding: "0.75rem 1rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", outline: "none", cursor: "not-allowed" }} 
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Amount Paying Now (₹) <span style={{color: "var(--danger)"}}>*</span></label>
                    <input 
                        name="paidAmount" 
                        type="number" 
                        required 
                        min="1" 
                        max={remainingBalance || undefined} 
                        value={paidAmount} 
                        onChange={(e) => setPaidAmount(Number(e.target.value))} 
                        placeholder="e.g. 2500" 
                        disabled={!selectedStudent}
                        style={{ padding: "0.75rem 1rem", background: selectedStudent ? "var(--bg-tertiary)" : "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", outline: "none", cursor: selectedStudent ? "text" : "not-allowed" }} 
                    />
                </div>
            </div>

            <div style={{ 
                padding: "1rem 1.5rem", 
                background: newBalance > 0 ? "rgba(245, 158, 11, 0.05)" : "rgba(34, 197, 94, 0.05)", 
                border: `1px solid ${newBalance > 0 ? "rgba(245, 158, 11, 0.2)" : "rgba(34, 197, 94, 0.2)"}`, 
                borderRadius: "var(--radius-md)", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                transition: "all 0.3s ease"
            }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                        {selectedStudent ? "Remaining Balance Before Payment:" : "Outstanding Balance:"}
                    </span>
                    {selectedStudent && (
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                            Current Debt: ₹{remainingBalance}
                        </span>
                    )}
                </div>
                
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>New Balance After Payment:</span>
                    <span style={{ fontSize: "1.5rem", fontWeight: 700, color: newBalance > 0 ? "#d97706" : "var(--success)" }}>
                        {selectedStudent ? `₹${newBalance >= 0 ? newBalance : 0}` : "₹0"}
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>Payment Method <span style={{color: "var(--danger)"}}>*</span></label>
                <select 
                    name="paymentMethod" 
                    required 
                    style={{ 
                        padding: "0.75rem 1rem", 
                        background: "var(--bg-tertiary)", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "var(--radius-md)", 
                        color: "var(--text-primary)", 
                        outline: "none", 
                        cursor: "pointer",
                        WebkitAppearance: "none",
                        MozAppearance: "none"
                    }}
                >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                <Link href="/fees" className="btn btn-secondary">
                    Cancel
                </Link>
                <button type="submit" className="btn btn-primary" disabled={!selectedStudent || isPending}>
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Recording...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Record Payment
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
