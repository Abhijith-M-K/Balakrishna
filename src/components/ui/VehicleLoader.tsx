"use client";

import React from "react";
import { Car } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";

export const VehicleLoader: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="vehicle-container">
        <div className="vehicle-moving">
          <Car size={40} fill="currentColor" />
        </div>
      </div>
      <div className="loader-text">
        {loadingMessage || "Loading..."}
      </div>
    </div>
  );
};
