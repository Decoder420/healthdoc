"use client";

import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";
import { departments } from "@/features/opd/data/mock-doctors";
import type { DoctorStatus } from "@/features/doctors/types";

export type DoctorFilterState = {
  query: string;
  departmentId: string | "all";
  status: DoctorStatus | "all";
};

type DoctorFiltersProps = {
  filters: DoctorFilterState;
  onChange: (filters: DoctorFilterState) => void;
  onClear: () => void;
  onAddClick?: () => void;
  canAdd?: boolean;
};

export function DoctorFilters({
  filters,
  onChange,
  onClear,
  onAddClick,
  canAdd = false,
}: DoctorFiltersProps) {
  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Doctor Directory</h2>
          <p className="text-xs text-muted-foreground">
            Search by name, employee ID, department, specialization, or license.
          </p>
        </div>
        {canAdd && onAddClick && (
          <Button type="button" onClick={onAddClick}>
            Add Doctor
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <FieldText
            label="Search"
            value={filters.query}
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
            }
            placeholder="Name, EMP ID, specialty, license..."
          />
        </div>
        <FieldSelect
          label="Department"
          value={filters.departmentId}
          onChange={(event) =>
            onChange({
              ...filters,
              departmentId: event.target.value as DoctorFilterState["departmentId"],
            })
          }
          options={[
            { value: "all", label: "All departments" },
            ...departments.map((department) => ({
              value: department.id,
              label: department.name,
            })),
          ]}
        />
        <FieldSelect
          label="Status"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as DoctorFilterState["status"],
            })
          }
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "on_leave", label: "On Leave" },
            { value: "inactive", label: "Inactive" },
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
