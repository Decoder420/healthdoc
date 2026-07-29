// Single service file for all nurse-module writes. Do not create a parallel
// class-based service for any of these — one pattern only, to avoid two
// different call-sites for the same feature.
//
// Endpoint status per Schema v3.5 §4 (documented API field contract):
//   /vitals            -> CONFIRMED (documented, no /nurse prefix)
//   everything else    -> NOT in the documented endpoint list. URLs below are
//                         best-guess based on table names (0023: nursing_handover_notes,
//                         intake_output_records, patient_movement_log). CONFIRM every
//                         one of these with backend before relying on them.
//
// REMOVED (per TL feedback — no backing table exists):
//   addMedicationAdministration, addProcedureAssistance — deleted along with
//   their forms/components. Do not re-add until backend confirms a table/endpoint.

import { api } from "../../../../lib/api";

import type { AddVitalsSchema, AddNursingNoteSchema } from "../validation";
import type { AddPatientMovementSchema } from "@/features/nurse/components/AddPatientMovementForm/validation";
import type { AddHandoverSchema } from "@/features/nurse/components/AddHandoverForm/validation";
import type { AddIntakeOutputSchema } from "@/features/nurse/components/AddIntakeOutputForm/validation";

export interface Vitals {
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
  bmi: number | null;
  whr: number | null;
}

export interface NursingHandoverNote {
  id: string;
  admission_id: string;
  shift: "morning" | "evening" | "night";
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  handed_over_to: string;
  created_by?: string;
  created_at?: string;
}

export interface IntakeOutputRecord {
  id: string;
  admission_id: string;
  recorded_at: string;
  entry_type:
    | "intake_oral"
    | "intake_iv"
    | "output_urine"
    | "output_drain"
    | "output_other";
  volume_ml: number;
  notes: string | null;
  created_by?: string;
  created_at?: string;
}

export interface PatientMovementLog {
  id: string;
  admission_id: string;
  from_ward_id: string | null;
  from_bed_id: string | null;
  to_ward_id: string;
  to_bed_id: string;
  moved_at: string;
  reason: string | null;
  moved_by: string;
}

/* ---------------- Vitals ---------------- */
// CONFIRMED endpoint per schema §4.
export async function addVitals(data: AddVitalsSchema) {
  return api<Vitals>("/vitals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Nursing Handover Notes ---------------- */
// Table confirmed (nursing_handover_notes, 0023). URL not documented — confirm.
export async function addHandover(data: AddHandoverSchema) {
  return api<NursingHandoverNote>("/nursing/handover-notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Intake / Output ---------------- */
// Table confirmed (intake_output_records, 0023). URL not documented — confirm.
// One call = one row (single entry_type + volume_ml), per TL feedback.
export async function addIntakeOutput(data: AddIntakeOutputSchema) {
  return api<IntakeOutputRecord>("/nursing/intake-output", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Patient Movement (transfer) ---------------- */
// Table confirmed (patient_movement_log, 0023), append-only. URL not documented — confirm.
export async function addPatientMovement(data: AddPatientMovementSchema) {
  return api<PatientMovementLog>("/nursing/movement", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Nursing Notes (generic) ---------------- */
// ⚠️ No separate "generic nursing note" table exists in the schema — only
// nursing_handover_notes. Confirm with backend whether this is actually the
// same table as addHandover() above (in which case, delete this function and
// use addHandover everywhere) or a genuinely different feature.
export async function addNursingNote(data: AddNursingNoteSchema) {
  return api<unknown>("/nursing/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}