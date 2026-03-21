"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { toggleAttendance } from "./actions";

export default function AttendanceToggle({ id, initialStatus }: { id: string, initialStatus: boolean }) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleAttendance(id, status);
            setStatus(!status);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            type="button"
            onClick={handleToggle}
            disabled={loading}
            style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                border: status ? "none" : "2px solid var(--border-color)",
                background: status ? "var(--success)" : "var(--bg-primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "all 0.2s"
            }}
        >
            {status && <Check size={18} strokeWidth={3} />}
        </button>
    );
}
