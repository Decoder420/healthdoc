"use client";

import type { Appointment } from "@/features/appointments/types";
import { todayIsoDate } from "@/features/appointments/data/mock-appointments";

type AppointmentStatsProps = {
  appointments: Appointment[];
};

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const today = todayIsoDate();
  const todays = appointments.filter((item) => item.date === today);
  const scheduled = todays.filter((item) => item.status === "scheduled").length;
  const inClinic = todays.filter((item) =>
    item.status === "checked-in" || item.status === "in-progress",
  ).length;
  const completed = todays.filter((item) => item.status === "completed").length;

  const stats = [
    { label: "Today's Total", value: todays.length, hint: "All appointments today" },
    { label: "Scheduled", value: scheduled, hint: "Awaiting check-in" },
    { label: "In Clinic", value: inClinic, hint: "Checked in or with doctor" },
    { label: "Completed", value: completed, hint: "Finished today" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="surface-card p-5">
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}
