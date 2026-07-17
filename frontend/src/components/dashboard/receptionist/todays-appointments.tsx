import Link from "next/link";
import type { AppointmentItem } from "@/features/dashboard/types";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<AppointmentItem["status"], string> = {
  scheduled: "bg-muted text-muted-foreground",
  "checked-in": "bg-info-muted text-info",
  "in-progress": "bg-accent text-accent-foreground",
  completed: "bg-success-muted text-success",
  cancelled: "bg-danger-muted text-danger",
};

const statusLabels: Record<AppointmentItem["status"], string> = {
  scheduled: "Scheduled",
  "checked-in": "Checked In",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function TodaysAppointments({ appointments }: { appointments: AppointmentItem[] }) {
  return (
    <div className="surface-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Today&apos;s Appointments
          </h2>
          <p className="text-xs text-muted-foreground">{appointments.length} scheduled today</p>
        </div>
        <Link href="/appointments" className="link-primary text-xs">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-muted/50">
                <td className="px-5 py-3.5 font-medium text-foreground">{apt.time}</td>
                <td className="px-5 py-3.5">
                  <p className="font-sans font-medium text-foreground">{apt.patientName}</p>
                  <p className="text-xs text-muted-foreground">{apt.patientId}</p>
                </td>
                <td className="px-5 py-3.5 text-foreground">{apt.doctorName}</td>
                <td className="px-5 py-3.5 text-foreground">{apt.department}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[apt.status],
                    )}
                  >
                    {statusLabels[apt.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
