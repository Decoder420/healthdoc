"use client";

import { useState } from "react";
import type {
  Appointment,
  AppointmentFieldErrors,
  AppointmentFormInput,
  AppointmentStatus,
} from "@/features/appointments/types";
import { APPOINTMENT_STATUS_LABELS } from "@/features/appointments/types";
import {
  toAppointmentFormInput,
  updateAppointment,
  updateAppointmentStatus,
  validateAppointmentForm,
} from "@/features/appointments/api";
import { getDoctorProfileById } from "@/features/doctors/api";
import { Button } from "@/components/ui/button";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { AppointmentSummary } from "@/components/appointments/appointment-summary";

type AppointmentDetailPanelProps = {
  appointment: Appointment;
  onClose: () => void;
  onUpdated: (appointment: Appointment) => void;
};

const NEXT_ACTIONS: Partial<
  Record<AppointmentStatus, { status: AppointmentStatus; label: string; variant?: "primary" | "secondary" | "outline" | "danger" | "success" }[]>
> = {
  scheduled: [
    { status: "checked-in", label: "Check In", variant: "primary" },
    { status: "no-show", label: "No Show", variant: "outline" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
  "checked-in": [
    { status: "in-progress", label: "Start Visit", variant: "primary" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
  "in-progress": [
    { status: "completed", label: "Complete", variant: "success" },
    { status: "cancelled", label: "Cancel", variant: "danger" },
  ],
};

export function AppointmentDetailPanel({
  appointment,
  onClose,
  onUpdated,
}: AppointmentDetailPanelProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [form, setForm] = useState<AppointmentFormInput>(() =>
    toAppointmentFormInput(appointment),
  );
  const [departmentFilter, setDepartmentFilter] = useState(
    () => appointment.departmentId,
  );
  const [errors, setErrors] = useState<AppointmentFieldErrors>({});
  const [error, setError] = useState("");

  function startEdit() {
    setForm(toAppointmentFormInput(appointment));
    setDepartmentFilter(appointment.departmentId);
    setErrors({});
    setError("");
    setMode("edit");
  }

  function handleSave() {
    const validation = validateAppointmentForm(form, { allowPastDate: true });
    setErrors(validation.errors);
    if (!validation.valid) {
      setError(validation.firstError ?? "Please fix the highlighted fields.");
      return;
    }

    const result = updateAppointment(appointment.id, form);
    if (!result.success) {
      setError(result.error);
      if (result.errors) setErrors(result.errors);
      return;
    }

    onUpdated(result.appointment);
    setMode("view");
    setError("");
  }

  function handleStatus(status: AppointmentStatus) {
    const result = updateAppointmentStatus(appointment.id, status);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onUpdated(result.appointment);
    setError("");
  }

  const canEdit =
    appointment.status === "scheduled" ||
    appointment.status === "checked-in" ||
    appointment.status === "in-progress";

  const actions = NEXT_ACTIONS[appointment.status] ?? [];

  return (
    <div className="surface-card space-y-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Appointment</p>
          <h2 className="text-xl font-semibold text-foreground">
            {appointment.patientName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {APPOINTMENT_STATUS_LABELS[appointment.status]} · {appointment.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "view" ? (
            <>
              {canEdit && (
                <Button type="button" variant="outline" onClick={startEdit}>
                  Reschedule / Edit
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
        <>
          <AppointmentSummary appointment={appointment} />
          {actions.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Update status
              </p>
              <div className="flex flex-wrap gap-2">
                {actions.map((action) => (
                  <Button
                    key={action.status}
                    type="button"
                    variant={action.variant ?? "outline"}
                    size="sm"
                    onClick={() => handleStatus(action.status)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {appointment.status === "scheduled" && (
            <p className="text-xs text-muted-foreground">
              Fee reference: ₹
              {getDoctorProfileById(appointment.doctorId)?.consultationFee ?? "—"}
              . Use OPD workflow after check-in for token generation.
            </p>
          )}
        </>
      ) : (
        <AppointmentForm
          value={form}
          onChange={setForm}
          errors={errors}
          excludeAppointmentId={appointment.id}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
        />
      )}
    </div>
  );
}
