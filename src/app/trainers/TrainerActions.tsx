"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTrainer } from "./actions";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function TrainerActions({ id, name }: { id: string; name: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const handleDelete = async () => {
        showLoading(`Deleting trainer ${name}...`);
        setIsDeleting(true);
        try {
            const result = await deleteTrainer(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Trainer deleted successfully");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
            hideLoading();
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="btn btn-secondary" 
                style={{ 
                    padding: "0.5rem", 
                    color: "var(--danger)",
                    borderColor: "rgba(239, 68, 68, 0.2)"
                }}
                title="Delete Trainer"
                disabled={isDeleting}
            >
                <Trash2 size={16} />
            </button>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Remove Trainer"
                message={`Are you sure you want to remove ${name}? This will unassign all their students.`}
                confirmText="Yes, Remove"
                type="danger"
            />
        </>
    );
}
