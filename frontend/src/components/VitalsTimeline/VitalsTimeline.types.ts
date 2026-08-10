export interface VitalRecord {
  id: string;
  patient_id: string;
  encounter_id: string | null;
  admission_id: string | null;
  measured_at: string;

  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null; // backend-computed
  waist_cm: number | null;
  hip_cm: number | null;
  whr: number | null; // backend-computed

  temp_c: number | null;
  pulse_bpm: number | null;
  resp_rate: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  spo2_pct: number | null;
  pain_score: number | null;

  created_by?: string; // [Blame] audit field — captured automatically, not submitted
  created_at?: string;
}