import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StudentForm } from "./StudentForm";

export default function AddStudentPage() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/students" className="btn btn-secondary" style={{ padding: "0.5rem" }}>
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 style={{ marginBottom: "0.25rem" }}>Add New Student</h1>
                    <p className="text-muted">Register a new applicant into the driving school system.</p>
                </div>
            </header>

            <div className="glass-card" style={{ maxWidth: "800px", padding: "2rem" }}>
                <StudentForm />
            </div>
        </div>
    );
}
