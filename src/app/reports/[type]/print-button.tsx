"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <button 
            onClick={handlePrint}
            className="btn btn-secondary" 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-secondary)" }}
        >
            <Printer size={18} /> Print PDF
        </button>
    );
}
