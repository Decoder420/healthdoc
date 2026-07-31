"use client";

import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";
import { departments } from "@/features/opd/data/mock-doctors";
import { getAllDoctors } from "@/features/doctors/api";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
  type AppointmentStatus,
  type AppointmentType,
} from "@/features/appointments/types";
import { todayIsoDate } from "@/features/appointments/data/mock-appointments";

export type AppointmentFilterState = {
  query: string;
  date: string | "all";
  doctorId: string | "all";
  departmentId: string | "all";
  status: AppointmentStatus | "all";
  type: AppointmentType | "all";
};

type AppointmentFiltersProps = {
  filters: AppointmentFilterState;
  onChange: (filters: AppointmentFilterState) => void;
  onClear: () => void;
  onBookClick: () => void;
};

export function AppointmentFilters({
  filters,
  onChange,
  onClear,
  onBookClick,
}: AppointmentFiltersProps) {
  const doctors = getAllDoctors();

  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Appointment Schedule
          </h2>
          <p className="text-xs text-muted-foreground">
            Search, filter by date/doctor, and book new visits.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({ ...filters, date: todayIsoDate() })
            }
          >
            Today
          </Button>
          <Button type="button" onClick={onBookClick}>
            Book Appointment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="md:col-span-2 xl:col-span-2">
          <FieldText
            label="Search"
            value={filters.query}
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
            }
            placeholder="Patient, UHID, doctor, reason..."
          />
        </div>
        <FieldText
          label="Date"
          type="date"
          value={filters.date === "all" ? "" : filters.date}
          onChange={(event) =>
            onChange({
              ...filters,
              date: event.target.value || "all",
            })
          }
          InputLabelProps={{ shrink: true }}
        />
        <FieldSelect
          label="Department"
          value={filters.departmentId}
          onChange={(event) =>
            onChange({
              ...filters,
              departmentId: event.target.value as AppointmentFilterState["departmentId"],
            })
          }
          options={[
            { value: "all", label: "All" },
            ...departments.map((department) => ({
              value: department.id,
              label: department.name,
            })),
          ]}
        />
        <FieldSelect
          label="Doctor"
          value={filters.doctorId}
          onChange={(event) =>
            onChange({
              ...filters,
              doctorId: event.target.value as AppointmentFilterState["doctorId"],
            })
          }
          options={[
            { value: "all", label: "All" },
            ...doctors.map((doctor) => ({
              value: doctor.id,
              label: doctor.name,
            })),
          ]}
        />
        <FieldSelect
          label="Status"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as AppointmentFilterState["status"],
            })
          }
          options={[
            { value: "all", label: "All" },
            ...(
              Object.entries(APPOINTMENT_STATUS_LABELS) as [
                AppointmentStatus,
                string,
              ][]
            ).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FieldSelect
          label="Visit Type"
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as AppointmentFilterState["type"],
            })
          }
          options={[
            { value: "all", label: "All types" },
            ...(
              Object.entries(APPOINTMENT_TYPE_LABELS) as [
                AppointmentType,
                string,
              ][]
            ).map(([value, label]) => ({ value, label })),
          ]}
        />
        <div className="flex items-end justify-end md:col-span-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
