import type { ReactNode } from "react";

/** Minimal patient shape used by lab dashboard chart aggregations. */
export type LabChartPatient = {
  patient: { gender: string };
  order: { priority: string; orderedAt: string };
};

export function buildHourlyPatientBuckets(patients: LabChartPatient[]) {
  const buckets: Record<string, number> = {};

  for (let hour = 0; hour < 24; hour++) {
    const nextHour = (hour + 1) % 24;
    const slot = `${String(hour).padStart(2, "0")}:00-${String(nextHour).padStart(2, "0")}:00`;
    buckets[slot] = 0;
  }

  patients.forEach((patient) => {
    const hour = Number(patient.order.orderedAt.substring(11, 13));
    const nextHour = (hour + 1) % 24;
    const slot = `${String(hour).padStart(2, "0")}:00-${String(nextHour).padStart(2, "0")}:00`;
    buckets[slot] = (buckets[slot] ?? 0) + 1;
  });

  return Object.entries(buckets).map(([slot, count]) => ({
    slot,
    count,
  }));
}

export function buildGenderCounts(patients: LabChartPatient[]) {
  const male = patients.filter((p) => p.patient.gender.toLowerCase() === "male").length;
  const female = patients.filter((p) => p.patient.gender.toLowerCase() === "female").length;
  const other = patients.filter((p) => p.patient.gender.toLowerCase() === "other").length;

  return [
    { name: "Male", value: male, fill: "#3B82F6" },
    { name: "Female", value: female, fill: "#EC4899" },
    { name: "Other", value: other, fill: "#10B981" },
  ].filter((d) => d.value > 0);
}

export function buildPriorityCounts(patients: LabChartPatient[]) {
  const urgent = patients.filter((p) => p.order.priority.toLowerCase() === "urgent").length;
  const emergency = patients.filter((p) => p.order.priority.toLowerCase() === "emergency").length;
  const elective = patients.filter((p) => p.order.priority.toLowerCase() === "elective").length;

  return [
    { name: "Urgent", value: urgent, fill: "#FF9800" },
    { name: "Emergency", value: emergency, fill: "#F44336" },
    { name: "Elective", value: elective, fill: "#4CAF50" },
  ].filter((d) => d.value > 0);
}

export type LabMetricCardConfig = {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick?: () => void;
};
