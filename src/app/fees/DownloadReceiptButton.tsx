"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export default function DownloadReceiptButton({ payment }: { payment: any }) {
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
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41); // Dark Gray
            doc.text("RECEIPT", pageWidth - margin, 24, { align: "right" });

            // Company Info (Left)
            doc.setFontSize(16);
            doc.setTextColor(33, 37, 41);
            doc.text("Balakrishna Driving School", margin, 22);
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125); // Muted gray
            doc.text("Address: Al-Mansoori business centre, Pookkad", margin, 28);
            doc.text("Chemmenchery, near South Indian Bank,", margin, 33);
            doc.text("Koyilandy, Kerala 673304", margin, 38);

            // Receipt Info (Right)
            doc.setFontSize(10);
            doc.setTextColor(33, 37, 41);
            doc.setFont("helvetica", "bold");
            doc.text(`Receipt No:`, pageWidth - margin - 40, 33);
            doc.text(`Date:`, pageWidth - margin - 40, 38);
            
            // Date Formatter (DD-MM-YYYY)
            const pDate = new Date(payment.paymentDate);
            const formattedDate = `${String(pDate.getDate()).padStart(2, '0')}-${String(pDate.getMonth() + 1).padStart(2, '0')}-${pDate.getFullYear()}`;
            
            doc.setFont("helvetica", "normal");
            doc.text(payment.receiptNumber, pageWidth - margin, 33, { align: "right" });
            doc.text(formattedDate, pageWidth - margin, 38, { align: "right" });

            // Divider Line
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.line(margin, 45, pageWidth - margin, 45);

            // --- BILL TO SECTION ---
            const studentName = payment.student?.name || "Student";
            const studentId = payment.student?.studentId || "N/A";
            const studentPhone = payment.student?.phoneNumber || "N/A";

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
            doc.text(`Phone: ${studentPhone}`, margin, 73);

            // --- PAYMENT TABLE ---
            autoTable(doc, {
                startY: 85,
                head: [["Description", "Payment Method", "Amount"]],
                body: [
                    ["Course Fee (Tuition / Installment)", payment.paymentMethod.replace("_", " "), `Rs. ${payment.paidAmount.toFixed(2)}`],
                ],
                theme: "grid",
                headStyles: { 
                    fillColor: [59, 130, 246], // Primary Blue
                    textColor: 255, 
                    fontStyle: "bold",
                    halign: "left"
                },
                columnStyles: {
                    0: { cellWidth: "auto" },
                    1: { halign: "center", cellWidth: 45 },
                    2: { halign: "right", cellWidth: 40 }
                },
                styles: { 
                    fontSize: 10, 
                    cellPadding: 6,
                    lineColor: [220, 220, 220],
                    textColor: [33, 37, 41]
                }
            });

            // --- SUMMARY TOTALS ---
            const finalY = (doc as any).lastAutoTable.finalY + 12;
            const summaryX = pageWidth - margin - 85; // Start X for summary section
            
            doc.setFontSize(10);
            doc.setTextColor(108, 117, 125);
            
            doc.text("Total Course Fee:", summaryX, finalY);
            doc.text(`Rs. ${payment.totalFee.toFixed(2)}`, pageWidth - margin, finalY, { align: "right" });

            const totalPaidSoFar = payment.totalFee - payment.balance;
            
            doc.text("Total Amount Paid:", summaryX, finalY + 7);
            doc.text(`Rs. ${totalPaidSoFar.toFixed(2)}`, pageWidth - margin, finalY + 7, { align: "right" });

            // Divider before balance
            doc.setDrawColor(220, 220, 220);
            doc.line(summaryX, finalY + 12, pageWidth - margin, finalY + 12);

            // Balance section
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41);
            doc.text("Remaining Balance:", summaryX, finalY + 19);
            
            // Conditional coloring for balance amount
            if (payment.balance > 0) {
                doc.setTextColor(220, 53, 69); // Danger red
            } else {
                doc.setTextColor(25, 135, 84); // Success green
            }
            doc.text(`Rs. ${payment.balance.toFixed(2)}`, pageWidth - margin, finalY + 19, { align: "right" });

            // --- FOOTER SECTION ---
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text("Thank you for choosing Balakrishna Driving School!", pageWidth / 2, pageHeight - 20, { align: "center" });
            doc.text("This is a computer-generated receipt and does not require a physical signature.", pageWidth / 2, pageHeight - 15, { align: "center" });

            doc.save(`${payment.receiptNumber}_Receipt.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF. Check console for details.");
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
                cursor: isGenerating ? "wait" : "pointer", 
                borderRadius: "0.375rem",
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                padding: "0.4rem 0.75rem",
                fontWeight: 500,
                fontSize: "0.875rem",
                opacity: isGenerating ? 0.7 : 1
            }}
            title="Download PDF Receipt"
            className="hover-bg-accent"
        >
            <Download size={16} /> 
            {isGenerating ? "Exporting..." : "PDF"}
            
            <style>{`
                .hover-bg-accent { transition: all 0.2s ease; }
                .hover-bg-accent:hover { background: rgba(99, 102, 241, 0.15); transform: translateY(-1px); }
            `}</style>
        </button>
    );
}
