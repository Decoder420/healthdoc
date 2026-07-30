"use client";

import { PatientInfo } from "@/features/pharmacy/types/types";

interface PatientInformationCardProps {
  patient: PatientInfo;
}

export default function PatientInformationCard({
  patient,
}: PatientInformationCardProps) {
  return (
    <div className="surface-card p-6">
      {/* Section Title */}
      <h2 className="mb-6 text-lg font-semibold">
        Patient Information
      </h2>

      {/* Patient Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm font-mono text-muted-foreground">
            Patient Name
          </p>
          <p className="mt-1 font-medium">
            {patient.patientName}
          </p>
        </div>

        <div>
          <p className="text-sm font-mono text-muted-foreground">
            UHID
          </p>
          <p className="mt-1 font-medium">
            {patient.uhid}
          </p>
        </div>

        <div>
          <p className="text-sm font-mono text-muted-foreground">
            Doctor
          </p>
          <p className="mt-1 font-medium">
            {patient.doctor}
          </p>
        </div>

        <div>
          <p className="text-sm font-mono text-muted-foreground">
            Visit Type
          </p>
          <p className="mt-1 font-medium">
            {patient.visitType}
          </p>
        </div>

        <div>
          <p className="text-sm font-mono text-muted-foreground">
            Prescription Number
          </p>
          <p className="mt-1 font-medium">
            {patient.prescriptionNumber}
          </p>
        </div>
      </div>
    </div>
  );
}