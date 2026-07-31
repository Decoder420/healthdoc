"use client";

import { useMemo } from "react";
import { FieldSelect, FieldText, FormSection } from "@/components/ui/mui-field";
import {
  APPOINTMENT_TYPE_LABELS,
  type AppointmentFieldErrors,
  type AppointmentFormInput,
  type AppointmentType,
} from "@/features/appointments/types";
import {
  formatAppointmentTime,
} from "@/features/appointments/data/mock-appointments";
import { getAvailableTimeSlots } from "@/features/appointments/api";
import { getAllPatients } from "@/features/patients/api";
import { getAllDoctors } from "@/features/doctors/api";
import { departments } from "@/features/opd/data/mock-doctors";

type AppointmentFormProps = {
  value: AppointmentFormInput;
  onChange: (value: AppointmentFormInput) => void;
  errors?: AppointmentFieldErrors;
  excludeAppointmentId?: string;
  departmentFilter?: string;
  onDepartmentFilterChange?: (departmentId: string) => void;
};

export function AppointmentForm({
  value,
  onChange,
  errors = {},
  excludeAppointmentId,
  departmentFilter = "",
  onDepartmentFilterChange,
}: AppointmentFormProps) {
  const patients = useMemo(() => getAllPatients(), []);
  const doctors = useMemo(
    () =>
      getAllDoctors().filter((doctor) => {
        if (doctor.status !== "active") return false;
        if (departmentFilter && doctor.departmentId !== departmentFilter) {
          return false;
        }
        return true;
      }),
    [departmentFilter],
  );

  const timeSlots = useMemo(
    () =>
      getAvailableTimeSlots({
        doctorId: value.doctorId,
        date: value.date,
        excludeAppointmentId,
      }),
    [value.doctorId, value.date, excludeAppointmentId],
  );

  const slotOptions = useMemo(() => {
    const options = timeSlots.map((slot) => ({
      value: slot,
      label: formatAppointmentTime(slot),
    }));
    if (value.time && !options.some((option) => option.value === value.time)) {
      options.unshift({
        value: value.time,
        label: `${formatAppointmentTime(value.time)} (current)`,
      });
    }
    return options;
  }, [timeSlots, value.time]);

  return (
    <div className="space-y-6">
      <FormSection title="Patient & Doctor" description="Who is visiting whom.">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldSelect
            label="Patient"
            value={value.patientUhid}
            onChange={(event) =>
              onChange({ ...value, patientUhid: event.target.value })
            }
            options={[
              { value: "", label: "Select patient" },
              ...patients.map((patient) => ({
                value: patient.uhid,
                label: `${patient.name} · ${patient.uhid}`,
              })),
            ]}
            errorText={errors.patientUhid}
          />
          <FieldSelect
            label="Department"
            value={departmentFilter}
            onChange={(event) => {
              onDepartmentFilterChange?.(event.target.value);
              onChange({ ...value, doctorId: "" });
            }}
            options={[
              { value: "", label: "All departments" },
              ...departments.map((department) => ({
                value: department.id,
                label: department.name,
              })),
            ]}
          />
          <div className="md:col-span-2">
            <FieldSelect
              label="Doctor"
              value={value.doctorId}
              onChange={(event) =>
                onChange({ ...value, doctorId: event.target.value, time: "" })
              }
              options={[
                { value: "", label: "Select doctor" },
                ...doctors.map((doctor) => ({
                  value: doctor.id,
                  label: `${doctor.name} · ${doctor.department} · ₹${doctor.consultationFee}`,
                })),
              ]}
              errorText={errors.doctorId}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Schedule" description="Date, slot, and visit type.">
        <div className="grid gap-4 md:grid-cols-3">
          <FieldText
            label="Date"
            type="date"
            value={value.date}
            onChange={(event) =>
              onChange({ ...value, date: event.target.value, time: "" })
            }
            errorText={errors.date}
            InputLabelProps={{ shrink: true }}
          />
          <FieldSelect
            label="Time"
            value={value.time}
            onChange={(event) =>
              onChange({ ...value, time: event.target.value })
            }
            options={[
              { value: "", label: value.doctorId && value.date ? "Select time" : "Select doctor & date first" },
              ...slotOptions,
            ]}
            errorText={errors.time}
            disabled={!value.doctorId || !value.date}
          />
          <FieldSelect
            label="Visit Type"
            value={value.type}
            onChange={(event) =>
              onChange({
                ...value,
                type: event.target.value as AppointmentType,
              })
            }
            options={(
              Object.entries(APPOINTMENT_TYPE_LABELS) as [
                AppointmentType,
                string,
              ][]
            ).map(([optionValue, label]) => ({
              value: optionValue,
              label,
            }))}
            errorText={errors.type}
          />
        </div>
      </FormSection>

      <FormSection title="Clinical notes">
        <div className="grid gap-4">
          <FieldText
            label="Reason for visit"
            value={value.reason}
            onChange={(event) =>
              onChange({ ...value, reason: event.target.value })
            }
            errorText={errors.reason}
            placeholder="e.g. Fever, follow-up BP check"
          />
          <FieldText
            label="Notes (optional)"
            value={value.notes}
            onChange={(event) =>
              onChange({ ...value, notes: event.target.value })
            }
            errorText={errors.notes}
            multiline
            minRows={2}
            placeholder="Any special instructions for the visit"
          />
        </div>
      </FormSection>
    </div>
  );
}
