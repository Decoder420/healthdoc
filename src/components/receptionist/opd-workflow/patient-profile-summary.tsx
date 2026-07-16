"use client";

import { useState } from "react";
import type { Patient } from "@/features/patients/types";
import { maskAadhaar, formatAbha } from "@/features/patients/utils/patient-validation";
import { InfoCard } from "@/components/receptionist/opd-workflow/form-controls";
import { CreateAbhaPanel } from "@/components/receptionist/opd-workflow/create-abha-panel";
import { Button } from "@/components/ui/button";

type PatientProfileSummaryProps = {
  patient: Patient;
  onPatientUpdated?: (patient: Patient) => void;
};

export function PatientProfileSummary({
  patient,
  onPatientUpdated,
}: PatientProfileSummaryProps) {
  const [showCreateAbha, setShowCreateAbha] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
          {patient.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={patient.photo} alt={patient.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-semibold text-primary">
              {patient.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard title="UHID">
            <p className="font-sans text-lg font-semibold text-primary">{patient.uhid}</p>
          </InfoCard>
          <InfoCard title="Patient Name">
            <p className="font-sans text-lg font-semibold text-foreground">{patient.name}</p>
          </InfoCard>
          <InfoCard title="Age / Gender">
            <p className="font-sans text-sm text-foreground">
              {patient.age} yrs · {patient.gender}
            </p>
          </InfoCard>
          <InfoCard title="Mobile">
            <p className="text-sm text-foreground">{patient.phone}</p>
          </InfoCard>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Email">
          <p className="text-sm text-foreground">{patient.email || "—"}</p>
        </InfoCard>
        <InfoCard title="Alternate Mobile">
          <p className="text-sm text-foreground">{patient.alternateMobile || "—"}</p>
        </InfoCard>
        <InfoCard title="Aadhaar">
          <p className="text-sm text-foreground">
            {patient.aadhaar ? maskAadhaar(patient.aadhaar) : "—"}
          </p>
        </InfoCard>
        <InfoCard title="ABHA">
          <p className="text-sm text-foreground">
            {patient.abha ? formatAbha(patient.abha) : "Not created"}
          </p>
          {!patient.abha && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowCreateAbha(true)}
            >
              Create ABHA
            </Button>
          )}
        </InfoCard>
        <InfoCard title="Identity Document">
          <p className="text-sm text-foreground">
            {patient.identityDocument.documentNumber
              ? `${patient.identityDocument.type.toUpperCase()} · ${patient.identityDocument.documentNumber}`
              : "—"}
          </p>
        </InfoCard>
        <InfoCard title="Guardian">
          <p className="text-sm text-foreground">
            {patient.guardian.name
              ? `${patient.guardian.name} (${patient.guardian.relation})`
              : "—"}
          </p>
          {patient.guardian.phone && (
            <p className="text-xs text-muted-foreground">{patient.guardian.phone}</p>
          )}
        </InfoCard>
        <InfoCard title="Address" className="md:col-span-2">
          <p className="text-sm text-foreground">{patient.address}</p>
        </InfoCard>
      </div>

      {showCreateAbha && !patient.abha && (
        <CreateAbhaPanel
          patientName={patient.name}
          uhid={patient.uhid}
          initialAadhaar={patient.aadhaar}
          initialPhone={patient.phone}
          onCancel={() => setShowCreateAbha(false)}
          onCreated={(_abha, updatedPatient) => {
            setShowCreateAbha(false);
            if (updatedPatient && onPatientUpdated) {
              onPatientUpdated(updatedPatient);
            }
          }}
        />
      )}
    </div>
  );
}
