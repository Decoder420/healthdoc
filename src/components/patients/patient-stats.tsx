"use client";

import type { Patient } from "@/features/patients/types";

type PatientStatsProps = {
  patients: Patient[];
};

export function PatientStats({ patients }: PatientStatsProps) {
  const withAbha = patients.filter((patient) => Boolean(patient.abha)).length;
  const withAadhaar = patients.filter((patient) => Boolean(patient.aadhaar)).length;
  const today = new Date().toDateString();
  const registeredToday = patients.filter(
    (patient) => new Date(patient.registeredAt).toDateString() === today,
  ).length;

  const stats = [
    { label: "Total Patients", value: patients.length, hint: "All registered records" },
    { label: "Registered Today", value: registeredToday, hint: "New registrations today" },
    {
      label: "With Aadhaar",
      value: withAadhaar,
      hint:
        patients.length > 0
          ? `${Math.round((withAadhaar / patients.length) * 100)}% linked`
          : "No records",
    },
    {
      label: "With ABHA",
      value: withAbha,
      hint:
        patients.length > 0
          ? `${Math.round((withAbha / patients.length) * 100)}% coverage`
          : "No records",
    },
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
