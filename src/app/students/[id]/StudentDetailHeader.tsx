"use client";

import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

interface StudentDetailHeaderProps {
    id: string;
    dbId: string;
    name: string;
    studentId: string;
    status: string;
}

export default function StudentDetailHeader({ id, dbId, name, studentId, status }: StudentDetailHeaderProps) {
    const { showLoading } = useLoading();

    return (
        <header className="page-header">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link 
                    href="/students" 
                    onClick={() => showLoading()}
                    className="btn btn-secondary" 
                    style={{ padding: "0.5rem" }}
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>{name}</h1>
                    <p className="text-muted" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>Student ID: {studentId}</span>
                        <span>&bull;</span>
                        <span className="badge badge-accent">{status}</span>
                    </p>
                </div>
            </div>
            <Link 
                href={`/students/${dbId}/edit`} 
                onClick={() => showLoading()}
                className="btn btn-secondary"
            >
                <Edit size={18} />
                Edit Student
            </Link>
        </header>
    );
}
