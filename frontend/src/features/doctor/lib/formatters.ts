import { FREQUENCY_OPTIONS, ROUTE_OPTIONS } from "../constants";
import type { Frequency, PrescriptionRoute } from "../types";

/** "34 yrs · Male" style demographics line. */
export function formatAgeSex(age_years: number, sex: string): string {
  const s = sex ? sex[0].toUpperCase() + sex.slice(1) : "";
  return `${age_years} yrs · ${s}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

const FREQUENCY_LABELS = Object.fromEntries(
  FREQUENCY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Frequency, string>;

const ROUTE_LABELS = Object.fromEntries(
  ROUTE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<PrescriptionRoute, string>;

export const frequencyLabel = (f: Frequency): string => FREQUENCY_LABELS[f] ?? f;
export const routeLabel = (r: PrescriptionRoute): string => ROUTE_LABELS[r] ?? r;

/** BMI from height/weight, or undefined if either is missing. Preview only. */
export function computeBmi(height_cm?: number, weight_kg?: number): number | undefined {
  if (!height_cm || !weight_kg) return undefined;
  const m = height_cm / 100;
  if (m <= 0) return undefined;
  return Math.round((weight_kg / (m * m)) * 10) / 10;
}

/** Waist-to-hip ratio, or undefined if either is missing. Preview only. */
export function computeWhr(waist_cm?: number, hip_cm?: number): number | undefined {
  if (!waist_cm || !hip_cm) return undefined;
  return Math.round((waist_cm / hip_cm) * 100) / 100;
}
