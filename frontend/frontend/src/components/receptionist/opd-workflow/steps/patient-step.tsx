"use client";

import type { NewPatientInput, Patient } from "@/features/patients/types";
import type { PatientFieldErrors } from "@/features/patients/utils/patient-validation";
import { validatePatientFields } from "@/features/patients/utils/patient-validation";
import { Button } from "@/components/ui/button";
import { PatientRegistrationForm } from "@/components/receptionist/opd-workflow/patient-registration-form";
import { PatientProfileSummary } from "@/components/receptionist/opd-workflow/patient-profile-summary";

type PatientStepProps = {
  patient: Patient | null;
  isNewPatient: boolean;
  form: NewPatientInput;
  errors: PatientFieldErrors;
  error?: string;
  onFormChange: (form: NewPatientInput) => void;
  onErrorsChange: (errors: PatientFieldErrors) => void;
  onClearError: (field: keyof PatientFieldErrors) => void;
  onSetError: (field: keyof PatientFieldErrors, message: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onUseExisting?: (patient: Patient) => void;
  onPatientUpdated?: (patient: Patient) => void;
};

export function PatientStep({
  patient,
  isNewPatient,
  form,
  errors,
  error,
  onFormChange,
  onErrorsChange,
  onClearError,
  onSetError,
  onBack,
  onContinue,
  onUseExisting,
  onPatientUpdated,
}: PatientStepProps) {
  function handleContinue() {
    if (!isNewPatient) {
      onContinue();
      return;
    }

    const validation = validatePatientFields(form);
    onErrorsChange(validation.errors);

    if (!validation.valid) {
      return;
    }

    onContinue();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {isNewPatient ? "Create Patient Profile & UHID" : "Patient Found"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isNewPatient
            ? "Fields marked required must be completed. Photo, Aadhaar, ABHA, email, alternate mobile, guardian, and identity document are optional."
            : "Review patient profile before proceeding to OPD registration."}
        </p>
      </div>

      {patient && !isNewPatient ? (
        <PatientProfileSummary
          patient={patient}
          onPatientUpdated={onPatientUpdated}
        />
      ) : (
        <PatientRegistrationForm
          form={form}
          errors={errors}
          onChange={onFormChange}
          onClearError={onClearError}
          onSetError={onSetError}
        />
      )}

      {error && (
        <div className="surface-card max-w-xl border-danger/30 bg-danger-muted/30 p-4">
          <p className="text-sm text-danger">{error}</p>
          {onUseExisting && patient && (
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={() => onUseExisting(patient)}
            >
              Use existing UHID {patient.uhid}
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleContinue}>
          {isNewPatient ? "Create UHID & Continue" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
