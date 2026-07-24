// VitalsTimeline.types.ts
// Strictly per HealthDoc_Database_Schema_v3_5.docx — `vitals` table (migration 0023).
//
// NOTE (temp_c): the schema names this column temp_c — Celsius. If the UI needs to
// display Fahrenheit, that conversion must be done explicitly in the component.
// Do not assume the API sends the value already in °F — confirm with backend first.
//
// NOTE (recorded_by): the schema doc's listed `vitals` columns do not include a named
// "recorded by" field. It may come from a common audit/created_by mixin used across
// tables — the exact field name is unconfirmed. Kept optional until backend confirms.
 
export interface VitalRecord {
  id: string;
  patient_id: string;
  encounter_id: string | null;
  admission_id: string | null;
  measured_at: string;
 
  temp_c: number | null;
  pulse_bpm: number | null;
  resp_rate: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  spo2_pct: number | null;
  pain_score: number | null;
 
  recorded_by?: string | null; // unconfirmed field name — verify with backend
}