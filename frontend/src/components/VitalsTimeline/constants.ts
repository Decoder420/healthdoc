/** Keyed by the API's field names — see VitalsTimeline.types.ts. */
export const VITAL_LABELS = {
  temp_c: "Temperature (°C)",
  pulse_bpm: "Pulse",
  resp_rate: "Respiratory rate",
  bp_systolic: "BP systolic",
  bp_diastolic: "BP diastolic",
  spo2_pct: "SpO₂",
  pain_score: "Pain score",
} as const;