import { VitalRecord } from "@/components/VitalsTimeline";

export const vitals: VitalRecord[] = [
  {
    id: "1",
    patient_id: "p1",
    encounter_id: null,
    admission_id: "adm-1",
    measured_at: "2026-07-22T08:00:00Z",
    temp_c: 37.0, // was 98.6°F — converted to Celsius, confirm real unit with backend
    pulse_bpm: 74,
    resp_rate: 18,
    bp_systolic: 120,
    bp_diastolic: 80,
    spo2_pct: 98,
    pain_score: null,
    recorded_by: "Nurse Anita",
  },
  {
    id: "2",
    patient_id: "p1",
    encounter_id: null,
    admission_id: "adm-1",
    measured_at: "2026-07-22T12:00:00Z",
    temp_c: 37.3, // was 99.1°F
    pulse_bpm: 78,
    resp_rate: 19,
    bp_systolic: 122,
    bp_diastolic: 82,
    spo2_pct: 97,
    pain_score: null,
    recorded_by: "Nurse Anita",
  },
  {
    id: "3",
    patient_id: "p1",
    encounter_id: null,
    admission_id: "adm-1",
    measured_at: "2026-07-22T16:00:00Z",
    temp_c: 37.1, // was 98.8°F
    pulse_bpm: 76,
    resp_rate: 18,
    bp_systolic: 118,
    bp_diastolic: 79,
    spo2_pct: 99,
    pain_score: null,
    recorded_by: "Nurse Rahul",
  },
];