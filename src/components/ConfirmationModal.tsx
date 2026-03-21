"use client";

import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "success" | "danger" | "warning";
}

export default function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "warning"
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            // Block scrolling on body when modal is open
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    const typeColors = {
        success: "var(--success)",
        danger: "var(--danger)",
        warning: "var(--warning)"
    };

    const modalContent = (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999, // Extremely high z-index
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            background: "rgba(0,0,0,0.6)", // Darker backdrop for better contrast
            backdropFilter: "blur(6px)",
            animation: "fade-in 0.2s ease-out"
        }}>
            <div className="glass-card" style={{
                width: "100%",
                maxWidth: "420px",
                padding: "2.5rem 2rem",
                position: "relative",
                boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)", // Smoother transition
                border: "1px solid rgba(255,255,255,0.1)",
                background: "var(--bg-primary)" // Ensure solid background to prevent see-through clipping
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "1.25rem",
                        right: "1.25rem",
                        background: "rgba(0,0,0,0.05)",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "0.5rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    className="hover-bg-danger"
                >
                    <X size={18} />
                </button>

                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ 
                        width: "72px", 
                        height: "72px", 
                        borderRadius: "50%", 
                        background: `rgba(${type === 'success' ? '16, 185, 129' : type === 'danger' ? '239, 68, 68' : '245, 158, 11' }, 0.15)`,
                        color: typeColors[type],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem",
                        boxShadow: `0 0 20px rgba(${type === 'success' ? '16, 185, 129' : type === 'danger' ? '239, 68, 68' : '245, 158, 11' }, 0.2)`
                    }}>
                        <AlertCircle size={36} />
                    </div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "1rem" }}>{message}</p>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button 
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: "0.8rem", fontWeight: 600 }}
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="btn"
                        style={{ 
                            flex: 1, 
                            padding: "0.8rem",
                            background: typeColors[type],
                            color: "white",
                            border: "none",
                            fontWeight: 700,
                            boxShadow: `0 4px 12px rgba(${type === 'success' ? '16, 185, 129' : type === 'danger' ? '239, 68, 68' : '245, 158, 11' }, 0.3)`
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes slide-up {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .hover-bg-danger:hover {
                    background: rgba(239, 68, 68, 0.1) !important;
                    color: var(--danger) !important;
                    transition: all 0.2s;
                }
            `}</style>
        </div>
    );

    return createPortal(modalContent, document.getElementById("modal-root") || document.body);
}
