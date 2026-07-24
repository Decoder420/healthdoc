// import { api } from "../../../../lib/api";

// import type {
//   AddVitalsSchema,
//   AddNursingNoteSchema,
//   AddMedicationAdministrationSchema,
//   AddIntakeOutputSchema,
//   AddPatientMovementSchema,
//   AddProcedureAssistanceSchema,
//   AddHandoverSchema,
// } from "../validation";
// /* ---------------- Vitals ---------------- */

// export async function addVitals(
//   data: AddVitalsSchema
// ) {
//   return api<void>("/nurse/vitals", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// /* ---------------- Nursing Notes ---------------- */

// export async function addNursingNote(
//   data: AddNursingNoteSchema
// ) {
//   return api<void>("/nurse/notes", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// /* ---------------- Medication ---------------- */

// export async function addMedication(
//   data: AddMedicationAdministrationSchema
// ) {
//   return api<void>("/nurse/medications", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// /* ---------------- Intake Output ---------------- */

// export async function addIntakeOutput(
//   data: AddIntakeOutputSchema
// ) {
//   return api<void>("/nurse/intake-output", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// /* ---------------- Handover ---------------- */

// export async function addHandover(
//   data: AddHandoverSchema
// ) {
//   return api<void>("/nurse/handover", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// /* ---------------- Patient Movement ---------------- */

// export async function addPatientMovement(
//   data: AddPatientMovementSchema
// ) {
//   return api<void>("/nurse/movement", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// /* ---------------- Procedure Assistance ---------------- */

// export async function addProcedure(
//   data: AddProcedureAssistanceSchema
// ) {
//   return api<void>("/nurse/procedure", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }


// nurse.service.ts
// Single service file for all nurse-module writes. Do not create a parallel
// class-based service for any of these (see vitals.service.ts note) — one
// pattern only, to avoid two different call-sites for the same feature.
//
// Endpoint status per Schema v3.5 §4 (documented API field contract):
//   /vitals            -> CONFIRMED (documented, no /nurse prefix)
//   everything else    -> NOT in the documented endpoint list. URLs below are
//                         best-guess based on table names (0023: nursing_handover_notes,
//                         intake_output_records, patient_movement_log). CONFIRM every
//                         one of these with backend before relying on them — none are
//                         guaranteed to match, including the /nurse prefix itself.
//   /medications        -> NO backing table exists yet (no per-dose eMAR table in schema).
//                         This call will fail until backend adds it. Flagged separately below.
//   /procedures          -> NO ward-level "procedure assistance" table exists in schema
//                         (only ot_records.scrub_nurse_notes, which is OT-specific, not ward).
 
import { api } from "../../../../lib/api";
 
import type {
  AddVitalsSchema,
  AddNursingNoteSchema,
  AddMedicationAdministrationSchema,
  AddIntakeOutputSchema,
  AddPatientMovementSchema,
  AddProcedureAssistanceSchema,
  AddHandoverSchema,
} from "../validation";
 
// TODO: move these to their proper */types files once confirmed with backend;
// kept minimal here just so service functions don't return `void`.
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
  shift: string;
  situation: string | null;
  background: string | null;
  assessment: string | null;
  recommendation: string | null;
  handed_over_to: string;
}
 
export interface IntakeOutputRecord {
  id: string;
  admission_id: string;
  recorded_at: string;
  entry_type: "intake_oral" | "intake_iv" | "output_urine" | "output_drain" | "output_other";
  volume_ml: number;
  notes: string | null;
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
 
/* ---------------- Medication Administration (eMAR) ---------------- */
// 🔴 BLOCKED: no per-dose medication-administration table exists in the schema
// (only prescription_items.status, which is one row per drug per prescription,
// not one row per scheduled dose with given/held/refused). This call has no
// backend to hit yet. Do not wire this into a real screen until backend confirms
// the table/endpoint — raise with B3 before this becomes a sprint blocker.
export async function addMedicationAdministration(
  data: AddMedicationAdministrationSchema
) {
  return api<unknown>("/medications/administration", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
 
/* ---------------- Procedure Assistance ---------------- */
// ⚠️ No ward-level procedure-assistance table exists in the schema. The only
// related table is ot_records.scrub_nurse_notes, which is OT-specific
// (operating theatre), not a general ward nursing feature. Confirm with
// backend what this actually maps to before relying on this endpoint.
export async function addProcedureAssistance(data: AddProcedureAssistanceSchema) {
  return api<unknown>("/nursing/procedure-assistance", {
    method: "POST",
    body: JSON.stringify(data),
  });
}