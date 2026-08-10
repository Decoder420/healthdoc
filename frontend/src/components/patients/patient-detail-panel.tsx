"use client";

import { useState } from "react";
import type { NewPatientInput, Patient } from "@/features/patients/types";
import { emptyPatientForm } from "@/features/patients/types";
import type { PatientFieldErrors } from "@/features/patients/utils/patient-validation";
import { validatePatientFields } from "@/features/patients/utils/patient-validation";
import { updatePatient } from "@/features/patients/api";
import { Button } from "@/components/ui/button";
import { PatientProfileSummary } from "@/components/receptionist/opd-workflow/patient-profile-summary";
import { PatientRegistrationForm } from "@/components/receptionist/opd-workflow/patient-registration-form";
import { CreateAbhaPanel } from "@/components/receptionist/opd-workflow/create-abha-panel";

type PatientDetailPanelProps = {
  patient: Patient;
  onClose: () => void;
  onUpdated: (patient: Patient) => void;
};

export function PatientDetailPanel({
  patient,
  onClose,
  onUpdated,
}: PatientDetailPanelProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [form, setForm] = useState<NewPatientInput>({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    alternateMobile: patient.alternateMobile,
    email: patient.email,
    address: patient.address,
    photo: patient.photo,
    aadhaar: patient.aadhaar,
    abha: patient.abha,
    guardian: { ...patient.guardian },
    identityDocument: { ...patient.identityDocument },
  });
  const [errors, setErrors] = useState<PatientFieldErrors>({});
  const [error, setError] = useState("");
  const [showCreateAbha, setShowCreateAbha] = useState(false);

  function startEdit() {
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      alternateMobile: patient.alternateMobile,
      email: patient.email,
      address: patient.address,
      photo: patient.photo,
      aadhaar: patient.aadhaar,
      abha: patient.abha,
      guardian: { ...patient.guardian },
      identityDocument: { ...patient.identityDocument },
    });
    setErrors({});
    setError("");
    setMode("edit");
  }

  function handleSave() {
    const validation = validatePatientFields(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      setError(validation.firstError ?? "Please fix the highlighted fields.");
      return;
    }

    const result = updatePatient(patient.uhid, form);
    if (!result.success) {
      setError(result.error);
      if (result.errors) setErrors(result.errors);
      return;
    }

    onUpdated(result.patient);
    setMode("view");
    setError("");
  }

  return (
    <div className="surface-card space-y-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Patient Record</p>
          <h2 className="text-xl font-semibold text-foreground">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">{patient.uhid}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "view" ? (
            <>
              <Button type="button" variant="outline" onClick={startEdit}>
                Edit Profile
              </Button>
              {!patient.abha && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateAbha(true)}
                >
                  Create ABHA
                </Button>
              )}
              <Button type="button" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={() => setMode("view")}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {mode === "view" ? (
        <PatientProfileSummary
          patient={patient}
          onPatientUpdated={onUpdated}
        />
      ) : (
        <PatientRegistrationForm
          form={form}
          errors={errors}
          onChange={(next) => {
            setForm(next);
            setError("");
          }}
          onClearError={(field) =>
            setErrors((current) => {
              const next = { ...current };
              delete next[field];
              return next;
            })
          }
          onSetError={(field, message) =>
            setErrors((current) => ({ ...current, [field]: message }))
          }
        />
      )}

      {showCreateAbha && !patient.abha && mode === "view" && (
        <CreateAbhaPanel
          patientName={patient.name}
          uhid={patient.uhid}
          initialAadhaar={patient.aadhaar}
          initialPhone={patient.phone}
          onCancel={() => setShowCreateAbha(false)}
          onCreated={(_abha, updated) => {
            setShowCreateAbha(false);
            if (updated) onUpdated(updated);
          }}
        />
      )}
    </div>
  );
}

export const emptyPatientEditForm = emptyPatientForm;
