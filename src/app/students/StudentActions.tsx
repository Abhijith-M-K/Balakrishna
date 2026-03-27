"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteStudent } from "./actions";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

export default function StudentActions({ id }: { id: string }) {
    const { showLoading, hideLoading } = useLoading();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize portal mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (showConfirm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showConfirm]);

    const handleDelete = async () => {
        setIsDeleting(true);
        setShowConfirm(false); // Close modal
        showLoading("Deleting student record...");
        
        try {
            const result = await deleteStudent(id);
            if (result?.error) {
                toast.error(result.error);
                hideLoading();
                setIsDeleting(false);
            } else {
                toast.success("Student deleted successfully");
                // hideLoading() will be handled by navigation or can be called here
                hideLoading();
            }
        } catch (error: any) {
            console.error("Failed to delete student:", error);
            toast.error("An error occurred while deleting the student.");
            hideLoading();
            setIsDeleting(false);
        }
    }

    const modalContent = (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
        }}>
            <div className="glass-card animate-fade-in" style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                maxWidth: "400px",
                width: "100%",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                position: "relative",
                display: "block"
            }}>
                <button 
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    style={{ 
                        position: "absolute", 
                        top: "1rem", right: "1rem", 
                        background: "none", border: "none", 
                        color: "var(--text-muted)", 
                        cursor: "pointer",
                        opacity: isDeleting ? 0.5 : 1
                    }}
                    className="hover-opacity"
                >
                    <X size={20} />
                </button>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem", width: "100%" }}>
                    <div style={{ 
                        width: "64px", height: "64px", 
                        borderRadius: "50%", 
                        background: "rgba(239, 68, 68, 0.1)", 
                        display: "flex", alignItems: "center", justifyContent: "center", 
                        color: "var(--danger)" 
                    }}>
                        <AlertTriangle size={32} />
                    </div>
                    
                    <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                            Delete Student Record
                        </h3>
                        <p style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--text-secondary)" }}>
                            Are you absolutely sure you want to delete this student? 
                            This action is <strong style={{ color: "var(--danger)" }}>permanent</strong> and will seamlessly erase all their fee and test history.
                        </p>
                    </div>
                </div>
                
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", width: "100%" }}>
                    <button 
                        onClick={() => setShowConfirm(false)}
                        disabled={isDeleting}
                        className="btn btn-secondary" 
                        style={{ flex: 1, justifyContent: "center" }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn" 
                        style={{ 
                            flex: 1, 
                            justifyContent: "center",
                            background: "var(--danger)", 
                            color: "white", 
                            border: "none",
                            opacity: isDeleting ? 0.8 : 1,
                            cursor: isDeleting ? "wait" : "pointer"
                        }}
                    >
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button 
                    onClick={() => setShowConfirm(true)}
                    disabled={isDeleting}
                    title="Delete Student"
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        padding: "0.4rem", 
                        color: "var(--danger)", 
                        background: "rgba(239, 68, 68, 0.1)", 
                        border: "none",
                        borderRadius: "0.375rem", 
                        cursor: "pointer",
                        opacity: isDeleting ? 0.5 : 1
                    }}
                    className="hover-opacity"
                >
                    <Trash2 size={16} />
                </button>
                <style>{`
                    .hover-opacity { transition: opacity 0.2s; }
                    .hover-opacity:hover { opacity: 0.8; }
                `}</style>
            </div>

            {/* Render the modal onto the DOM root to escape the nested table overflow property! */}
            {mounted && showConfirm && createPortal(modalContent, document.body)}
        </>
    )
}
