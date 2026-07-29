import { HandoverNote } from "@/features/nurse/components/HandoverNotes/HandoverNotes.types";

// admission_id values here match the mock bed->admission lookup in
// lib/data/admissionsByBed.ts ("adm-1", "adm-2") so the dashboard demo actually
// shows data when a bed is selected.
export const HANDOVER_NOTES: HandoverNote[] = [
  {
    id: "1",
    admission_id: "adm-1",
    shift: "morning",
    situation: "Patient stable, on IV antibiotics for pneumonia.",
    background: "Admitted 3 days ago with fever and productive cough.",
    assessment: "Vitals stable, temperature trending down, tolerating oral intake.",
    recommendation: "Continue IV Ceftriaxone. Monitor blood pressure every 4 hours.",
    handed_over_to: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
    created_by: "a1e2d3c4-0000-4a5b-9c1d-000000000010",
    created_at: "2026-07-16T09:00:00Z",
  },
  {
    id: "2",
    admission_id: "adm-1",
    shift: "evening",
    situation: "Patient resting comfortably, evening medications administered.",
    background: "Same admission — pneumonia, day 3 of antibiotics.",
    assessment: "Intake/output chart updated, no new complaints.",
    recommendation: "Continue current medication schedule, recheck vitals at night shift start.",
    handed_over_to: "b3f1a2c4-1111-4a5b-9c1d-000000000002",
    created_by: "b3f1a2c4-1111-4a5b-9c1d-000000000001",
    created_at: "2026-07-16T15:00:00Z",
  },
  {
    id: "3",
    admission_id: "adm-1",
    shift: "night",
    situation: "Night shift uneventful, patient slept well.",
    background: "Same admission — pneumonia, day 3 of antibiotics.",
    assessment: "Morning vitals pending, no distress reported overnight.",
    recommendation: "Continue antibiotics as prescribed, take morning vitals early.",
    handed_over_to: "a1e2d3c4-0000-4a5b-9c1d-000000000010",
    created_by: "b3f1a2c4-1111-4a5b-9c1d-000000000002",
    created_at: "2026-07-16T23:00:00Z",
  },
  {
    id: "4",
    admission_id: "adm-2",
    shift: "morning",
    situation: "Patient shifted after blood sugar monitoring.",
    background: "Admitted for uncontrolled diabetes management.",
    assessment: "Blood glucose trending toward normal range.",
    recommendation: "Continue diabetic diet and glucose charting every 6 hours.",
    handed_over_to: "c4d5e6f7-2222-4a5b-9c1d-000000000003",
    created_by: "c4d5e6f7-2222-4a5b-9c1d-000000000004",
    created_at: "2026-07-16T09:00:00Z",
  },
];