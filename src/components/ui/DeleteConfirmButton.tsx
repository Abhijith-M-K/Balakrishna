"use client";

import React, { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

interface DeleteConfirmButtonProps {
  id: string;
  entityName: string;
  action: (id: string) => Promise<{ success?: boolean; error?: string }>;
  confirmMessage?: string;
  title?: string;
  variant?: "icon" | "button";
}

export default function DeleteConfirmButton({
  id,
  entityName,
  action,
  confirmMessage,
  title,
  variant = "icon"
}: DeleteConfirmButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleDelete = () => {
    setIsOpen(false); // Close immediately to let global loader take over
    showLoading(`Deleting ${entityName}...`);
    startTransition(async () => {
      try {
        const result = await action(id);
        if (result.success) {
          toast.success(`${entityName} deleted successfully`);
        } else if (result.error) {
          toast.error(result.error);
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        hideLoading(true);
      }
    });
  };

  const modalContent = (
    <div className="modal-root" style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem"
    }}>
      <div 
        className="modal-backdrop" 
        onClick={() => setIsOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.4)", // Darker, more premium slate backdrop
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          animation: "fadeInBackdrop 0.3s ease-out"
        }}
      />
      <div className="glass-card modal-container" style={{
        maxWidth: "440px",
        width: "100%",
        padding: "2rem",
        textAlign: "center",
        position: "relative",
        background: "rgba(255, 255, 255, 0.85)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        animation: "slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "0.5rem"
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          background: "rgba(239, 68, 68, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
          color: "var(--danger)",
          transform: "rotate(-5deg)"
        }}>
          <AlertTriangle size={32} />
        </div>

        <h3 style={{ 
          marginBottom: "0.75rem", 
          fontSize: "1.5rem", 
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em"
        }}>
          {title || `Delete ${entityName}?`}
        </h3>
        
        <p style={{ 
          color: "var(--text-secondary)", 
          marginBottom: "2rem", 
          lineHeight: 1.6,
          fontSize: "1rem"
        }}>
          {confirmMessage || `Are you sure you want to permanently remove this ${entityName.toLowerCase()}? This action cannot be undone.`}
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-secondary"
            disabled={isPending}
            style={{ 
              flex: 1, 
              padding: "0.75rem",
              borderRadius: "0.75rem"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isPending}
            style={{ 
              flex: 1, 
              background: "var(--danger)", 
              color: "white",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
            }}
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="delete-icon-btn"
          title={`Delete ${entityName}`}
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            color: "var(--danger)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            padding: "0.4rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-danger"
          style={{ 
            background: "rgba(239, 68, 68, 0.1)",
            color: "var(--danger)",
            borderRadius: "0.75rem" 
          }}
        >
          <Trash2 size={16} /> Delete
        </button>
      )}

      {isOpen && mounted && createPortal(modalContent, document.body)}

      <style jsx>{`
        .delete-icon-btn:hover {
          background: var(--danger) !important;
          color: white !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </>
  );
}
