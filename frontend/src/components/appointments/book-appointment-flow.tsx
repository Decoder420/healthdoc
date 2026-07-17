"use client";

import { useState } from "react";
import {
  emptyAppointmentForm,
  type Appointment,
  type AppointmentFieldErrors,
  type AppointmentFormInput,
} from "@/features/appointments/types";
import {
  createAppointment,
  validateAppointmentForm,
} from "@/features/appointments/api";
import { todayIsoDate } from "@/features/appointments/data/mock-appointments";
import { Button } from "@/components/ui/button";
import { AppointmentForm } from "@/components/appointments/appointment-form";

type BookAppointmentFlowProps = {
  onCancel: () => void;
  onBooked: (appointment: Appointment) => void;
};

export function BookAppointmentFlow({
  onCancel,
  onBooked,
}: BookAppointmentFlowProps) {
  const [form, setForm] = useState<AppointmentFormInput>({
    ...emptyAppointmentForm,
    date: todayIsoDate(),
  });
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [errors, setErrors] = useState<AppointmentFieldErrors>({});
  const [error, setError] = useState("");

  function handleSubmit() {
    const validation = validateAppointmentForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      setError(validation.firstError ?? "Please fix the highlighted fields.");
      return;
    }

    const result = createAppointment(form);
    if (!result.success) {
      setError(result.error);
      if (result.errors) setErrors(result.errors);
      return;
    }

    onBooked(result.appointment);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Appointments Module</p>
          <h1 className="text-2xl font-semibold text-foreground">
            Book Appointment
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule a patient visit with an available doctor and time slot.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Confirm Booking
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="surface-card p-5">
        <AppointmentForm
          value={form}
          onChange={setForm}
          errors={errors}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
        />
      </div>
    </div>
  );
}
