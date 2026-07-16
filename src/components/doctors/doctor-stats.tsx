"use client";

import type { DoctorProfile } from "@/features/doctors/types";

type DoctorStatsProps = {
  doctors: DoctorProfile[];
};

export function DoctorStats({ doctors }: DoctorStatsProps) {
  const active = doctors.filter((doctor) => doctor.status === "active").length;
  const onLeave = doctors.filter((doctor) => doctor.status === "on_leave").length;
  const departments = new Set(doctors.map((doctor) => doctor.departmentId)).size;

  const stats = [
    { label: "Total Doctors", value: doctors.length, hint: "All registered profiles" },
    { label: "Active", value: active, hint: "Available for OPD assignment" },
    { label: "On Leave", value: onLeave, hint: "Temporarily unavailable" },
    { label: "Departments", value: departments, hint: "Covered specialties" },
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
