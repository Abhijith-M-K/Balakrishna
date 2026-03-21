"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { formatDate } from "@/lib/formatters";

export default function DownloadStudentCardButton({ student }: { student: any }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import("jspdf");
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 14;

            // --- FORM HEADER ---
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41);
            doc.text("Balakrishna Driving School", pageWidth / 2, 22, { align: "center" });
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(108, 117, 125);
            doc.text("Al-Mansoori business centre, Pookkad, Chemmenchery", pageWidth / 2, 28, { align: "center" });
            doc.text("near South Indian Bank, Koyilandy, Kerala 673304", pageWidth / 2, 33, { align: "center" });

            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.line(margin, 40, pageWidth - margin, 40);

            // --- APPLICATION TITLE ---
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 37, 41);
            doc.text("APPLICATION FOR ADMISSION / ENROLLMENT", pageWidth / 2, 50, { align: "center" });

            // Application Details (Right Aligned variables)
            const sDate = new Date(student.registrationDate);
            const stringDate = `${String(sDate.getDate()).padStart(2, '0')}-${String(sDate.getMonth() + 1).padStart(2, '0')}-${sDate.getFullYear()}`;
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Application No: ${student.studentId}`, pageWidth - margin, 60, { align: "right" });
            doc.text(`Date of Admission: ${stringDate}`, pageWidth - margin, 65, { align: "right" });

            // --- DATA TABLE STRUCTURE ---
            // Construct explicitly strict bordered UI grids mirroring paper applications
            autoTable(doc, {
                startY: 75,
                body: [
                    ["Full Name of Applicant", student.name.toUpperCase()],
                    ["Mobile / Contact Number", student.phoneNumber],
                    ["Residential Address", student.address || "N/A"],
                    ["Date of Birth", formatDate(student.dateOfBirth)],
                    ["Aadhar Number", student.idProofNumber || "N/A"],
                    ["License Category Applied", `${student.licenseType} Class Vehicle`],
                    ["Total Course Fee", `Rs. ${student.totalFee.toFixed(2)}`],
                    ["Current Processing Status", student.status.replace("_", " ")],
                ],
                theme: "plain", 
                styles: {
                    fontSize: 10,
                    cellPadding: 7,
                    lineColor: [60, 60, 60],
                    lineWidth: 0.1, // Actual drawn borders for paper format
                    textColor: [33, 37, 41]
                },
                columnStyles: {
                    0: { fontStyle: "bold", cellWidth: 75, fillColor: [248, 249, 250] }, // Soft gray label headers
                    1: { cellWidth: "auto" }
                }
            });

            // --- LEGAL DECLARATION & SIGNATURES ---
            const finalY = (doc as any).lastAutoTable.finalY + 15;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("Declaration:", margin, finalY);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(
                "I hereby declare that the information provided above is true and correct to the best of my knowledge and belief. I agree to abide by the formal rules, regulations, and training schedules of Balakrishna Driving School.", 
                margin, finalY + 7, { maxWidth: pageWidth - margin * 2 }
            );

            // Signature Block Renderings
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            
            // Left block (Applicant)
            doc.text("__________________________", margin, finalY + 45);
            doc.text("Signature of the Applicant", margin, finalY + 50);

            // Right block (Admin)
            doc.text("__________________________", pageWidth - margin - 50, finalY + 45);
            doc.text("Authorized Signatory", pageWidth - margin - 44, finalY + 50);

            // --- FOOTER ---
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setDrawColor(220, 220, 220);
            doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Generated via Official Management Portal - Balakrishna Driving School", pageWidth / 2, pageHeight - 12, { align: "center" });

            doc.save(`${student.studentId}_Application_Form.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF check console");
        }
        setIsGenerating(false);
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={isGenerating}
            title="Download Application Form"
            style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                padding: "0.4rem", 
                color: "var(--accent-primary)", 
                background: "rgba(99, 102, 241, 0.1)", 
                border: "none",
                borderRadius: "0.375rem", 
                cursor: isGenerating ? "wait" : "pointer",
                opacity: isGenerating ? 0.5 : 1
            }}
            className="hover-opacity"
        >
            <FileText size={16} />
        </button>
    );
}
