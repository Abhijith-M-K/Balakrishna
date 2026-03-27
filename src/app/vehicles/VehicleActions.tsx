"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteVehicle } from "./actions";
import { toast } from "sonner";
import { useLoading } from "@/context/LoadingContext";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function VehicleActions({ id, regNo }: { id: string; regNo: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    const handleDelete = async () => {
        showLoading(`Deleting vehicle ${regNo}...`);
        setIsDeleting(true);
        try {
            const result = await deleteVehicle(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Vehicle deleted successfully");
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
                title="Delete Vehicle"
                disabled={isDeleting}
            >
                <Trash2 size={16} />
            </button>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Vehicle"
                message={`Are you sure you want to permanently remove vehicle ${regNo}? This action cannot be undone.`}
                confirmText="Delete Vehicle"
                type="danger"
            />
        </>
    );
}
