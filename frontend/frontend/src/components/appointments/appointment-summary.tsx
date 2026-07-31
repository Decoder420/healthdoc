"use client";

import type { Appointment } from "@/features/appointments/types";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from "@/features/appointments/types";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/features/appointments/data/mock-appointments";

type AppointmentSummaryProps = {
  appointment: Appointment;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export function AppointmentSummary({ appointment }: AppointmentSummaryProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {appointment.id}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">
          {appointment.patientName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatAppointmentDate(appointment.date)} ·{" "}
          {formatAppointmentTime(appointment.time)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="UHID" value={appointment.patientUhid} />
        <InfoRow label="Mobile" value={appointment.patientPhone} />
        <InfoRow label="Doctor" value={appointment.doctorName} />
        <InfoRow label="Department" value={appointment.department} />
        <InfoRow
          label="Visit Type"
          value={APPOINTMENT_TYPE_LABELS[appointment.type]}
        />
        <InfoRow
          label="Status"
          value={APPOINTMENT_STATUS_LABELS[appointment.status]}
        />
        <div className="sm:col-span-2">
          <InfoRow label="Reason" value={appointment.reason} />
        </div>
        <div className="sm:col-span-2">
          <InfoRow label="Notes" value={appointment.notes} />
        </div>
      </div>
    </div>
  );
}
