/**
 * Mirrors `VitalsOut` from `GET /nursing/patients/{patient_id}/vitals`.
 *
 * Two corrections from the imported version:
 *
 *  - `bloodPressure` was a single string ("120/80"), which vitalsChart.tsx then
 *    had to pick apart with a regex to plot systolic and diastolic. The API
 *    sends `bp_systolic` and `bp_diastolic` as integers, so the string was a
 *    lossy intermediate the chart had to undo — and any reading the regex did
 *    not match dropped silently to null.
 *  - temperature was rendered "°F". The column is `temp_c` and the API
 *    validates it to 20–45, which is Celsius. A febrile 39 shown as 39 °F reads
 *    as profound hypothermia.
 *
 * Every measurement is nullable: a nurse taking a pulse and SpO2 at the bedside
 * is not obliged to also record height, and a chart must plot the gap rather
 * than a zero.
 */
export interface VitalRecord {
  id: string;
  patient_id: string;
  encounter_id: string | null;
  admission_id: string | null;
  measured_at: string;

  height_cm: string | null;
  weight_kg: string | null;
  /** Derived server-side from height and weight. Never sent by the client. */
  bmi: string | null;
  waist_cm: string | null;
  hip_cm: string | null;
  whr: string | null;

  /** Celsius. */
  temp_c: string | null;
  pulse_bpm: number | null;
  resp_rate: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  spo2_pct: number | null;
  pain_score: number | null;

  created_by: string;
  created_at: string;
}
