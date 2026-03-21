import { PrismaClient } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import PaymentForm from "./PaymentForm";

export const dynamic = 'force-dynamic';

export default async function AddFeePaymentPage() {
    // Fetch students to populate the dropdown and calculate balances
    const studentsRaw = await prisma.student.findMany({
        orderBy: { name: 'asc' },
        include: { feePayments: true }
    });

    // Strip down data and calculate exact outstanding debts
    const students = studentsRaw.map((s: any) => {
        const paid = s.feePayments.reduce((sum: number, p: any) => sum + p.paidAmount, 0);
        return {
            id: s.id,
            name: s.name,
            studentId: s.studentId,
            totalFee: s.totalFee,
            balance: s.totalFee - paid
        };
    }).filter((s: any) => s.balance > 0);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/fees" className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Record Payment</h1>
                    <p className="text-muted">Register an incoming fee and generate a receipt.</p>
                </div>
            </header>

            <div className="glass-card" style={{ maxWidth: "800px", padding: "2rem" }}>
                <PaymentForm students={students} />
            </div>
        </div>
    );
}
