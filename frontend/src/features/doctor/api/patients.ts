/**
 * Patient reads for the summary sidebar. These are separate calls on purpose:
 * a queue token carries token columns, not a patient's clinical record.
 */
import { mockAllergies, mockPatientHistory, mockPatientRecords } from "@/lib/mock";
import type { Allergy, Patient, PatientHistoryEntry } from "../types";

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** GET /api/v1/patients/{id} */
export async function getPatient(patientId: string): Promise<Patient | null> {
  return delay(mockPatientRecords.find((p) => p.id === patientId) ?? null);
}

/** GET /api/v1/patients/{id}/history — consent-gated on the real endpoint. */
export async function getPatientHistory(patientId: string): Promise<PatientHistoryEntry[]> {
  return delay(mockPatientHistory[patientId] ?? []);
}

/**
 * Active allergies for a patient. `inactive`, `refuted` and `entered_in_error`
 * rows are filtered out here — they stay in the table (corrected, never
 * deleted) but must not drive a prescribing warning.
 */
export async function listAllergies(patientId: string): Promise<Allergy[]> {
  return delay(
    mockAllergies.filter((a) => a.patient_id === patientId && a.status === "active"),
  );
}
