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
import { Button } from "@/components/ui/button";

type AppointmentListProps = {
  appointments: Appointment[];
  selectedId?: string | null;
  onSelect: (appointment: Appointment) => void;
};

function statusClass(status: Appointment["status"]) {
  switch (status) {
    case "scheduled":
      return "text-primary";
    case "checked-in":
      return "text-info";
    case "in-progress":
      return "text-amber-700 dark:text-amber-300";
    case "completed":
      return "text-emerald-700 dark:text-emerald-300";
    case "cancelled":
    case "no-show":
      return "text-danger";
    default:
      return "text-muted-foreground";
  }
}

export function AppointmentList({
  appointments,
  selectedId,
  onSelect,
}: AppointmentListProps) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Appointments</h2>
        <p className="text-xs text-muted-foreground">
          {appointments.length} record{appointments.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Reason</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  No appointments match the current filters.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => {
                const isSelected = selectedId === appointment.id;
                return (
                  <tr
                    key={appointment.id}
                    className={isSelected ? "bg-accent/40" : "hover:bg-muted/40"}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-primary">
                        {formatAppointmentTime(appointment.time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatAppointmentDate(appointment.date)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">
                        {appointment.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.patientUhid}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-foreground">{appointment.doctorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.department}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      {APPOINTMENT_TYPE_LABELS[appointment.type]}
                    </td>
                    <td className="max-w-48 truncate px-5 py-3.5 text-muted-foreground">
                      {appointment.reason || "—"}
                    </td>
                    <td
                      className={`px-5 py-3.5 font-medium ${statusClass(appointment.status)}`}
                    >
                      {APPOINTMENT_STATUS_LABELS[appointment.status]}
                    </td>
                    <td className="px-5 py-3.5">
                      <Button
                        type="button"
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={() => onSelect(appointment)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
