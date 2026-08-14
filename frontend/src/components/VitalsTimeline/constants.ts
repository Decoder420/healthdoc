export const VITAL_LABELS = {
  temp_c: "Temperature",
  pulse_bpm: "Pulse",
  resp_rate: "Respiratory Rate",
  blood_pressure: "Blood Pressure", // display-only label; not a field on VitalRecord
  spo2_pct: "SpO₂",
  pain_score: "Pain Score",
} as const;