"use client";

import { Download } from "lucide-react";

interface ExportButtonProps {
    data: any[];
    title: string;
}

export default function ExportButton({ data, title }: ExportButtonProps) {
    const exportToCSV = () => {
        if (!data || data.length === 0) return;

        // Flatten data and pick keys
        const headers = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object');
        const csvRows = [];
        
        // Add headers
        csvRows.push(headers.join(','));

        // Add rows
        for (const row of data) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button 
            onClick={exportToCSV}
            className="btn btn-secondary" 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            disabled={!data || data.length === 0}
        >
            <Download size={18} /> Export CSV
        </button>
    );
}
