"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export default function DownloadReceiptButton({ record }: { record: any }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            // Dynamic imports prevent Next.js SSR window errors
            const { jsPDF } = await import("jspdf");
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF();
            
            // Document Configurations
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 14;

            // --- HEADER SECTION ---
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41);
            doc.text("ADDITIONAL CLASS RECEIPT", pageWidth - margin, 24, { align: "right" });

            // Company Info (Left)
            doc.setFontSize(16);
            doc.setTextColor(33, 37, 41);
            doc.text("Balakrishna Driving School", margin, 22);
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125);
            doc.text("Address: Al-Mansoori business centre, Pookkad", margin, 28);
            doc.text("Chemmenchery, near South Indian Bank,", margin, 33);
            doc.text("Koyilandy, Kerala 673304", margin, 38);

            // Receipt Info (Right)
            doc.setFontSize(10);
            doc.setTextColor(33, 37, 41);
            doc.setFont("helvetica", "bold");
            doc.text(`Receipt No:`, pageWidth - margin - 40, 33);
            doc.text(`Date:`, pageWidth - margin - 40, 38);
            
            const pDate = new Date(record.paymentDate);
            const formattedDate = `${String(pDate.getDate()).padStart(2, '0')}-${String(pDate.getMonth() + 1).padStart(2, '0')}-${pDate.getFullYear()}`;
            
            doc.setFont("helvetica", "normal");
            doc.text(record.receiptNumber, pageWidth - margin, 33, { align: "right" });
            doc.text(formattedDate, pageWidth - margin, 38, { align: "right" });

            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.line(margin, 45, pageWidth - margin, 45);

            // --- BILL TO SECTION ---
            const studentName = record.student?.name || "Student";
            const studentId = record.student?.studentId || "N/A";

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(108, 117, 125);
            doc.text("BILLED TO:", margin, 56);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41);
            doc.text(studentName, margin, 63);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125);
            doc.text(`Student ID: ${studentId}`, margin, 68);

            // --- PAYMENT TABLE ---
            autoTable(doc, {
                startY: 75,
                head: [["Description", "License", "Method", "Amount"]],
                body: [
                    [
                        "Additional Practical Driving Class", 
                        record.licenseType, 
                        record.paymentMethod.replace("_", " "), 
                        `Rs. ${record.amount.toFixed(2)}`
                    ],
                ],
                theme: "grid",
                headStyles: { 
                    fillColor: [79, 70, 229], // Indigo
                    textColor: 255, 
                    fontStyle: "bold"
                },
                columnStyles: {
                    3: { halign: "right" }
                },
                styles: { fontSize: 10, cellPadding: 6 }
            });

            const finalY = (doc as any).lastAutoTable.finalY + 15;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`Total Amount Paid: Rs. ${record.amount.toFixed(2)}`, pageWidth - margin, finalY, { align: "right" });

            if (record.notes) {
                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                doc.setTextColor(100, 100, 100);
                doc.text(`Notes: ${record.notes}`, margin, finalY + 15);
            }

            // --- FOOTER SECTION ---
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text("Thank you for choosing Balakrishna Driving School!", pageWidth / 2, pageHeight - 20, { align: "center" });

            doc.save(`${record.receiptNumber}_AdditionalClass.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF.");
        }
        setIsGenerating(false);
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={isGenerating}
            style={{ 
                background: "rgba(99, 102, 241, 0.1)", 
                border: "1px solid rgba(99, 102, 241, 0.2)", 
                color: "var(--accent-primary)", 
                cursor: "pointer", 
                borderRadius: "0.375rem",
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                padding: "0.4rem 0.75rem",
                fontSize: "0.875rem"
            }}
            className="hover-bg-accent"
        >
            <Download size={16} /> 
            {isGenerating ? "..." : "PDF"}
        </button>
    );
}
