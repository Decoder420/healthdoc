import { api } from "../../../../lib/api";

import type {
  AddVitalsSchema,
  AddNursingNoteSchema,
  AddMedicationAdministrationSchema,
  AddIntakeOutputSchema,
  AddPatientMovementSchema,
  AddProcedureAssistanceSchema,
} from "../validation";
/* ---------------- Vitals ---------------- */

export async function addVitals(
  data: AddVitalsSchema
) {
  return api<void>("/nurse/vitals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Nursing Notes ---------------- */

export async function addNursingNote(
  data: AddNursingNoteSchema
) {
  return api<void>("/nurse/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Medication ---------------- */

export async function addMedication(
  data: AddMedicationAdministrationSchema
) {
  return api<void>("/nurse/medications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Intake Output ---------------- */

export async function addIntakeOutput(
  data: AddIntakeOutputSchema
) {
  return api<void>("/nurse/intake-output", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Handover ---------------- */

export async function addHandover(
  data: AddHandoverSchema
) {
  return api<void>("/nurse/handover", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Patient Movement ---------------- */

export async function addPatientMovement(
  data: AddPatientMovementSchema
) {
  return api<void>("/nurse/movement", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ---------------- Procedure Assistance ---------------- */

export async function addProcedure(
  data: AddProcedureAssistanceSchema
) {
  return api<void>("/nurse/procedure", {
    method: "POST",
    body: JSON.stringify(data),
  });
}