"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { updateTestStatus } from "./actions";
import { TestStatus } from "@prisma/client";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function TestResultButtons({ id, currentStatus }: { id: string, currentStatus: TestStatus }) {
    const [loading, setLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ 
        isOpen: boolean, 
        status: TestStatus | null,
        title: string,
        message: string,
        type: "success" | "danger"
    }>({
        isOpen: false,
        status: null,
        title: "",
        message: "",
        type: "success"
    });

    const triggerModal = (status: TestStatus) => {
        setModalConfig({
            isOpen: true,
            status,
            title: status === "PASSED" ? "Mark as Passed?" : "Mark as Failed?",
            message: status === "PASSED" 
                ? "This will record the student as having successfully passed their driving test and update their status to Completed."
                : "This will record a failed attempt. The student will need to be rescheduled for a retest.",
            type: status === "PASSED" ? "success" : "danger"
        });
    };

    const handleConfirm = async () => {
        if (!modalConfig.status) return;
        setLoading(true);
        try {
            await updateTestStatus(id, modalConfig.status);
        } catch (e) {
            console.error(e);
            alert("Failed to update test result");
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus !== "PENDING") {
        return (
            <div style={{ 
                padding: "0.5rem 1rem", 
                borderRadius: "var(--radius-md)", 
                background: currentStatus === "PASSED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: currentStatus === "PASSED" ? "var(--success)" : "var(--danger)",
                fontWeight: 600,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
            }}>
                {currentStatus === "PASSED" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {currentStatus}
            </div>
        );
    }

    return (
        <>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button 
                    onClick={() => triggerModal("PASSED")}
                    disabled={loading}
                    className="btn"
                    style={{ 
                        padding: "0.5rem 1rem", 
                        fontSize: "0.85rem", 
                        background: "rgba(16, 185, 129, 0.1)", 
                        color: "var(--success)", 
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                    }}
                >
                    <CheckCircle size={16} /> Mark Passed
                </button>
                <button 
                    onClick={() => triggerModal("FAILED")}
                    disabled={loading}
                    className="btn"
                    style={{ 
                        padding: "0.5rem 1rem", 
                        fontSize: "0.85rem", 
                        background: "rgba(239, 68, 68, 0.1)", 
                        color: "var(--danger)", 
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                    }}
                >
                    <XCircle size={16} /> Mark Failed
                </button>
            </div>

            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.status === "PASSED" ? "Yes, Passed" : "Yes, Failed"}
            />
        </>
    );
}
