"use client";

import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

interface DispenseHeaderProps {
  onBack?: () => void;
}

export default function DispenseHeader({
  onBack,
}: DispenseHeaderProps) {
  return (
    <div className="mb-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="btn btn-ghost btn-sm mb-4"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          {
            label: "Pharmacy",
            href: "/pharmacist",
          },
          {
            label: "Prescription Queue",
            href: "/pharmacist",
          },
          {
            label: "Dispense",
          },
        ]}
      />

      {/* Title */}
      <div className="mt-4">
        <h1 className="text-3xl font-bold">
          Dispense Prescription
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review the prescription, verify stock availability, and dispense medications.
        </p>
      </div>
    </div>
  );
}