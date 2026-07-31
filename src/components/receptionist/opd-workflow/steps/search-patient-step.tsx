"use client";

import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import {
  formatAadhaar,
  formatAbha,
} from "@/features/patients/utils/patient-validation";
import type { Patient } from "@/features/patients/types";
import {
  PATIENT_SEARCH_OPTIONS,
  type PatientSearchType,
} from "@/features/patients/types/search";

type SearchPatientStepProps = {
  searchType: PatientSearchType;
  searchQuery: string;
  foundPatient: Patient | null;
  searchFailed: boolean;
  onSearchTypeChange: (type: PatientSearchType) => void;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onContinueWithFound: () => void;
  onRegisterNew: () => void;
  onCreateAbhaForFound?: () => void;
  error?: string;
};

function formatSearchValue(type: PatientSearchType, value: string) {
  if (type === "aadhaar") return formatAadhaar(value);
  if (type === "abha") return formatAbha(value);
  if (type === "uhid") return value.toUpperCase();
  return value;
}

function sanitizeSearchValue(type: PatientSearchType, value: string) {
  if (type === "aadhaar") return value.replace(/\D/g, "").slice(0, 12);
  if (type === "abha") return value.replace(/\D/g, "").slice(0, 14);
  if (type === "mobile") return value;
  return value;
}

export function SearchPatientStep({
  searchType,
  searchQuery,
  foundPatient,
  searchFailed,
  onSearchTypeChange,
  onSearchQueryChange,
  onSearch,
  onContinueWithFound,
  onRegisterNew,
  onCreateAbhaForFound,
  error,
}: SearchPatientStepProps) {
  const selectedOption =
    PATIENT_SEARCH_OPTIONS.find((option) => option.value === searchType) ??
    PATIENT_SEARCH_OPTIONS[0];

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchQuery.trim()) onSearch();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Search Existing Patient</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You must search first. New patient registration is allowed only when search returns no match.
        </p>
      </div>

      <div className="surface-card max-w-2xl space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2" onKeyDown={handleKeyDown}>
          <FieldSelect
            label="Search By"
            value={searchType}
            onChange={(event) =>
              onSearchTypeChange(event.target.value as PatientSearchType)
            }
            options={PATIENT_SEARCH_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <FieldText
            label={selectedOption.label}
            value={formatSearchValue(searchType, searchQuery)}
            onChange={(event) =>
              onSearchQueryChange(
                sanitizeSearchValue(searchType, event.target.value),
              )
            }
            placeholder={selectedOption.placeholder}
            helperText={selectedOption.helper}
            errorText={error}
            autoFocus
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={onSearch} disabled={!searchQuery.trim()}>
            Search Patient
          </Button>
          {foundPatient && (
            <Button type="button" variant="outline" onClick={onContinueWithFound}>
              Continue with {foundPatient.uhid}
            </Button>
          )}
        </div>
      </div>

      {foundPatient && (
        <div className="surface-card max-w-2xl space-y-3 border-success/30 bg-success-muted/20 p-5">
          <p className="text-sm font-semibold text-success">Patient found</p>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium text-foreground">{foundPatient.name}</span>
            </p>
            <p>
              <span className="text-muted-foreground">UHID: </span>
              <span className="font-medium text-primary">{foundPatient.uhid}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Mobile: </span>
              <span className="text-foreground">{foundPatient.phone}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Aadhaar: </span>
              <span className="text-foreground">
                {foundPatient.aadhaar
                  ? formatAadhaar(foundPatient.aadhaar)
                  : "Not linked"}
              </span>
            </p>
            <p className="md:col-span-2">
              <span className="text-muted-foreground">ABHA: </span>
              <span className="text-foreground">
                {foundPatient.abha ? formatAbha(foundPatient.abha) : "Not created"}
              </span>
            </p>
          </div>

          {!foundPatient.abha && onCreateAbhaForFound && (
            <Button type="button" variant="outline" onClick={onCreateAbhaForFound}>
              Create ABHA for this patient
            </Button>
          )}
        </div>
      )}

      {searchFailed && !foundPatient && (
        <div className="surface-card max-w-2xl space-y-3 border-warning/30 bg-warning-muted/20 p-5">
          <p className="text-sm font-semibold text-warning">No matching patient found</p>
          <p className="text-sm text-muted-foreground">
            Search completed with no results. You may now register a new patient with this{" "}
            {selectedOption.label.toLowerCase()}.
          </p>
          <Button type="button" onClick={onRegisterNew}>
            Register New Patient
          </Button>
        </div>
      )}

      <div className="surface-muted max-w-2xl p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Sample search values</p>
        <p className="mt-1">UHID: UHID202500142</p>
        <p>Aadhaar: 456789012345</p>
        <p>ABHA: 12-3456-7890-1234</p>
        <p>Mobile: +91 98765 43210</p>
      </div>
    </div>
  );
}
