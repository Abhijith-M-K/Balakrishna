"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export default function DownloadStudentListButton({ students }: { students: any[] }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            // Dynamic imports prevent Next.js SSR window errors
            const { jsPDF } = await import("jspdf");
            const autoTable = (await import("jspdf-autotable")).default;

            // Use landscape mode for wider tables across more columns
            const doc = new jsPDF("landscape");
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 14;

            // --- HEADER ---
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41);
            doc.text("Student Roster Report", margin, 24);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125);
            doc.text("Balakrishna Driving School", margin, 30);
            
            const rawDate = new Date();
            const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${rawDate.getFullYear()}`;
            
            doc.text(`Generated on: ${formattedDate}`, margin, 35);
            doc.text(`Total Records: ${students.length}`, margin, 40);

            // --- TABLE CONTENT ---
            const tableData = students.map(s => {
                const sDate = new Date(s.registrationDate);
                const stringDate = `${String(sDate.getDate()).padStart(2, '0')}-${String(sDate.getMonth() + 1).padStart(2, '0')}-${sDate.getFullYear()}`;
                
                return [
                    s.studentId,
                    s.name,
                    s.phoneNumber,
                    s.licenseType,
                    stringDate,
                    `Rs. ${s.totalFee || 0}`,
                    s.status
                ];
            });

            autoTable(doc, {
                startY: 48,
                head: [["ID", "Name", "Phone", "License", "Enrolled", "Total Fee", "Status"]],
                body: tableData,
                theme: "grid",
                headStyles: { 
                    fillColor: [59, 130, 246], 
                    textColor: 255, 
                    fontStyle: "bold"
                },
                styles: { 
                    fontSize: 9, 
                    cellPadding: 5,
                    textColor: [33, 37, 41],
                    lineColor: [220, 220, 220]
                },
                alternateRowStyles: {
                    fillColor: [248, 249, 250]
                }
            });

            // --- FOOTER ---
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Balakrishna Driving School - Internal Document", pageWidth / 2, pageHeight - 10, { align: "center" });

            doc.save(`Student_Roster_${formattedDate}.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF check console");
        }
        setIsGenerating(false);
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={isGenerating || students.length === 0}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            title="Export this filtered list as a PDF"
        >
            <Download size={18} />
            {isGenerating ? "Exporting..." : "Export PDF"}
        </button>
    );
}
