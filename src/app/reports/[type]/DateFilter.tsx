"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Filter, X } from "lucide-react";

export default function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [from, setFrom] = useState(searchParams.get("from") || "");
    const [to, setTo] = useState(searchParams.get("to") || "");

    const handleApply = () => {
        if (from && to && new Date(to) < new Date(from)) {
            alert("End date cannot be earlier than start date.");
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        if (from) params.set("from", from);
        else params.delete("from");
        
        if (to) params.set("to", to);
        else params.delete("to");
        
        router.push(`?${params.toString()}`);
    };

    const handleClear = () => {
        setFrom("");
        setTo("");
        router.push("?");
    };

    return (
        <div className="no-print glass-card" style={{ 
            padding: "1rem", 
            marginBottom: "2rem", 
            display: "flex", 
            alignItems: "center", 
            gap: "1.5rem",
            flexWrap: "wrap",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ padding: "0.5rem", background: "rgba(91, 75, 223, 0.1)", borderRadius: "8px", color: "var(--accent-primary)" }}>
                    <Filter size={18} />
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Filter by Date Range</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>From:</span>
                    <div style={{ position: "relative" }}>
                        <Calendar size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input 
                            type="date" 
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            style={{ 
                                padding: "0.5rem 0.5rem 0.5rem 2rem", 
                                borderRadius: "6px", 
                                border: "1px solid var(--border-color)",
                                fontSize: "0.85rem",
                                outline: "none",
                                background: "var(--bg-primary)"
                            }} 
                        />
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>To:</span>
                    <div style={{ position: "relative" }}>
                        <Calendar size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input 
                            type="date" 
                            value={to}
                            min={from}
                            onChange={(e) => setTo(e.target.value)}
                            style={{ 
                                padding: "0.5rem 0.5rem 0.5rem 2rem", 
                                borderRadius: "6px", 
                                border: "1px solid var(--border-color)",
                                fontSize: "0.85rem",
                                outline: "none",
                                background: "var(--bg-primary)"
                            }} 
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
                <button 
                    onClick={handleApply}
                    className="btn btn-primary" 
                    style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                >
                    Apply Filter
                </button>
                {(from || to) && (
                    <button 
                        onClick={handleClear}
                        className="btn btn-secondary" 
                        style={{ padding: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem" }}
                    >
                        <X size={14} /> Clear
                    </button>
                )}
            </div>
        </div>
    );
}
