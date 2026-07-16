"use client";

import { useState } from "react";
import type { NewPatientInput, Patient } from "@/features/patients/types";
import { emptyPatientForm } from "@/features/patients/types";
import type { PatientFieldErrors } from "@/features/patients/utils/patient-validation";
import { validatePatientFields } from "@/features/patients/utils/patient-validation";
import type { PatientSearchType } from "@/features/patients/types/search";
import { createPatient, searchPatientByType } from "@/features/patients/api";
import { Button } from "@/components/ui/button";
import { SearchPatientStep } from "@/components/receptionist/opd-workflow/steps/search-patient-step";
import { PatientRegistrationForm } from "@/components/receptionist/opd-workflow/patient-registration-form";
import { CreateAbhaPanel } from "@/components/receptionist/opd-workflow/create-abha-panel";

type RegisterPatientFlowProps = {
  onCancel: () => void;
  onRegistered: (patient: Patient) => void;
};

type FlowStep = "search" | "register";

export function RegisterPatientFlow({
  onCancel,
  onRegistered,
}: RegisterPatientFlowProps) {
  const [step, setStep] = useState<FlowStep>("search");
  const [searchType, setSearchType] = useState<PatientSearchType>("uhid");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchFailed, setSearchFailed] = useState(false);
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
  const [showCreateAbha, setShowCreateAbha] = useState(false);

  const [form, setForm] = useState<NewPatientInput>({ ...emptyPatientForm });
  const [errors, setErrors] = useState<PatientFieldErrors>({});
  const [submitError, setSubmitError] = useState("");

  function handleSearch() {
    const query = searchQuery.trim();
    if (!query) {
      setSearchError(`Please enter a ${searchType.toUpperCase()} to search.`);
      setFoundPatient(null);
      setSearchFailed(false);
      return;
    }

    if (searchType === "aadhaar" && query.replace(/\D/g, "").length !== 12) {
      setSearchError("Aadhaar number must be 12 digits.");
      setSearchFailed(false);
      return;
    }

    if (searchType === "abha" && query.replace(/\D/g, "").length !== 14) {
      setSearchError("ABHA number must be 14 digits.");
      setSearchFailed(false);
      return;
    }

    if (searchType === "mobile") {
      const digits = query.replace(/\D/g, "");
      const mobile =
        digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        setSearchError("Enter a valid 10-digit mobile number.");
        setSearchFailed(false);
        return;
      }
    }

    const patient = searchPatientByType(searchType, query);
    if (patient) {
      setFoundPatient(patient);
      setSearchError("");
      setSearchFailed(false);
      setShowCreateAbha(false);
      return;
    }

    setFoundPatient(null);
    setSearchFailed(true);
    setSearchError(
      `No patient found for this ${searchType.toUpperCase()}. You can now register a new patient.`,
    );
  }

  function handleRegisterNew() {
    if (!searchFailed) return;

    const prefill: NewPatientInput = { ...emptyPatientForm };
    if (searchType === "aadhaar") {
      prefill.aadhaar = searchQuery.replace(/\D/g, "").slice(0, 12);
    }
    if (searchType === "abha") {
      prefill.abha = searchQuery.replace(/\D/g, "").slice(0, 14);
    }
    if (searchType === "mobile") {
      prefill.phone = searchQuery;
    }

    setForm(prefill);
    setErrors({});
    setSubmitError("");
    setStep("register");
  }

  function handleCreate() {
    const validation = validatePatientFields(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      setSubmitError(validation.firstError ?? "Please fix the highlighted fields.");
      return;
    }

    const result = createPatient(form);
    if (!result.success) {
      setSubmitError(result.error);
      if (result.errors) setErrors(result.errors);
      if (result.existingPatient) {
        setFoundPatient(result.existingPatient);
        setStep("search");
        setSearchFailed(false);
      }
      return;
    }

    onRegistered(result.patient);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Register Patient</h2>
          <p className="text-sm text-muted-foreground">
            Search first. Registration is allowed only after search fails.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Close
        </Button>
      </div>

      {step === "search" && (
        <>
          <SearchPatientStep
            searchType={searchType}
            searchQuery={searchQuery}
            foundPatient={foundPatient}
            searchFailed={searchFailed}
            error={searchError}
            onSearchTypeChange={(type) => {
              setSearchType(type);
              setSearchQuery("");
              setSearchError("");
              setFoundPatient(null);
              setSearchFailed(false);
              setShowCreateAbha(false);
            }}
            onSearchQueryChange={(value) => {
              setSearchQuery(value);
              setSearchError("");
              setFoundPatient(null);
              setSearchFailed(false);
              setShowCreateAbha(false);
            }}
            onSearch={handleSearch}
            onContinueWithFound={() => {
              if (foundPatient) onRegistered(foundPatient);
            }}
            onRegisterNew={handleRegisterNew}
            onCreateAbhaForFound={() => setShowCreateAbha(true)}
          />

          {showCreateAbha && foundPatient && !foundPatient.abha && (
            <CreateAbhaPanel
              patientName={foundPatient.name}
              uhid={foundPatient.uhid}
              initialAadhaar={foundPatient.aadhaar}
              initialPhone={foundPatient.phone}
              onCancel={() => setShowCreateAbha(false)}
              onCreated={(_abha, updated) => {
                setShowCreateAbha(false);
                if (updated) setFoundPatient(updated);
              }}
            />
          )}
        </>
      )}

      {step === "register" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStep("search");
                setSearchFailed(true);
              }}
            >
              Back to Search
            </Button>
            <Button type="button" onClick={handleCreate}>
              Create UHID
            </Button>
          </div>

          {submitError && (
            <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
              {submitError}
            </div>
          )}

          <PatientRegistrationForm
            form={form}
            errors={errors}
            onChange={(next) => {
              setForm(next);
              setSubmitError("");
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
        </div>
      )}
    </div>
  );
}
