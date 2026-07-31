"use client";

import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

export type PatientFilterState = {
  query: string;
  gender: "all" | "male" | "female" | "other";
  hasAbha: "all" | "yes" | "no";
};

type PatientFiltersProps = {
  filters: PatientFilterState;
  onChange: (filters: PatientFilterState) => void;
  onClear: () => void;
  onRegisterClick: () => void;
};

export function PatientFilters({
  filters,
  onChange,
  onClear,
  onRegisterClick,
}: PatientFiltersProps) {
  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Patient Directory</h2>
          <p className="text-xs text-muted-foreground">
            Search by name, UHID, mobile, Aadhaar, or ABHA.
          </p>
        </div>
        <Button type="button" onClick={onRegisterClick}>
          Register Patient
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <FieldText
            label="Search"
            value={filters.query}
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
            }
            placeholder="Name, UHID, mobile, Aadhaar, ABHA..."
          />
        </div>
        <FieldSelect
          label="Gender"
          value={filters.gender}
          onChange={(event) =>
            onChange({
              ...filters,
              gender: event.target.value as PatientFilterState["gender"],
            })
          }
          options={[
            { value: "all", label: "All" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
        />
        <FieldSelect
          label="ABHA Status"
          value={filters.hasAbha}
          onChange={(event) =>
            onChange({
              ...filters,
              hasAbha: event.target.value as PatientFilterState["hasAbha"],
            })
          }
          options={[
            { value: "all", label: "All" },
            { value: "yes", label: "Has ABHA" },
            { value: "no", label: "No ABHA" },
          ]}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}
