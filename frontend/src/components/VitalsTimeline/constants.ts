// VitalsTimeline.constants.ts
// Keys renamed to match VitalRecord (VitalsTimeline.types.ts) field names — snake_case,
// per HealthDoc_Database_Schema_v3_5.docx §4.2. "blood_pressure" is not a real column
// (bp_systolic and bp_diastolic are two separate fields in the schema) — kept here only
// as a display label for the combined "systolic/diastolic" column shown in the UI.

export const VITAL_LABELS = {
  temp_c: "Temperature",
  pulse_bpm: "Pulse",
  resp_rate: "Respiratory Rate",
  blood_pressure: "Blood Pressure", // display-only label; not a field on VitalRecord
  spo2_pct: "SpO₂",
} as const;