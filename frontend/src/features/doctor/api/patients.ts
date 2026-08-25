/**
 * Patient reads for the summary sidebar. These are separate calls on purpose:
 * a queue token carries token columns, not a patient's clinical record.
 *
 * Retired from fixtures (P1.1). `getPatient` had no backend at all until
 * GET /patients/{id} was added — the mock was standing in for missing product,
 * not missing wiring.
 */
import { api, ApiError } from "@/lib/api";
import type { Allergy, Patient, PatientHistoryEntry } from "../types";

/** GET /patients/{id} */
export async function getPatient(patientId: string): Promise<Patient | null> {
  try {
    return await api<Patient>(`/patients/${patientId}`);
  } catch (error) {
    // 404 covers "no such patient", "another facility's patient" and
    // "soft-deleted" — the endpoint deliberately does not distinguish them,
    // because a distinct error confirms the id exists.
    if (error instanceof ApiError && error.code === 404) return null;
    throw error;
  }
}

/**
 * The shape GET /patients/{id}/history actually returns: normalised, and
 * role-tiered server-side. A doctor gets all six lists; a nurse gets visits
 * and encounters with the SOAP fields stripped; a receptionist gets visits
 * only. The keys below are therefore optional — their absence is a role
 * boundary, not an error.
 */
interface PatientHistoryResponse {
  visits: Array<{
    visit_id: string;
    visit_number: string;
    visit_type: string;
    status: string;
    started_at: string | null;
  }>;
  encounters?: Array<{ encounter_id: string; visit_id: string }>;
  diagnoses?: Array<{ encounter_id: string; diagnosis_text: string; is_primary: boolean }>;
}

/**
 * GET /patients/{id}/history — access-logged, and consent-gated on the real
 * endpoint.
 *
 * The response is normalised; the sidebar wants diagnoses grouped under the
 * visit they were made in. That join is diagnosis -> encounter_id -> encounter
 * -> visit_id, and it is done here rather than in the component so the view
 * keeps taking the flat shape it already renders.
 *
 * The previous fixture invented a per-visit `department` field that the
 * endpoint does not return and the visits table does not carry. Rather than
 * display a fabricated one, the projection omits it — see the type.
 */
export async function getPatientHistory(patientId: string): Promise<PatientHistoryEntry[]> {
  const response = await api<PatientHistoryResponse>(`/patients/${patientId}/history`);

  const visitIdByEncounter = new Map(
    (response.encounters ?? []).map((e) => [e.encounter_id, e.visit_id]),
  );

  const diagnosesByVisit = new Map<string, string[]>();
  for (const diagnosis of response.diagnoses ?? []) {
    const visitId = visitIdByEncounter.get(diagnosis.encounter_id);
    if (!visitId) continue;
    const existing = diagnosesByVisit.get(visitId) ?? [];
    // Primary diagnosis first — the sidebar shows a short list and the
    // principal one should not fall off the end of it.
    if (diagnosis.is_primary) existing.unshift(diagnosis.diagnosis_text);
    else existing.push(diagnosis.diagnosis_text);
    diagnosesByVisit.set(visitId, existing);
  }

  return response.visits.map((visit) => ({
    visit_id: visit.visit_id,
    visit_number: visit.visit_number,
    visit_date: visit.started_at ?? "",
    diagnoses: diagnosesByVisit.get(visit.visit_id) ?? [],
  }));
}

/**
 * Active allergies for a patient.
 *
 * The filtering happens server-side: GET /allergies/patients/{id} defaults to
 * `include_inactive=false`. `inactive`, `refuted` and `entered_in_error` rows
 * stay in the table — corrected, never deleted — but must not drive a
 * prescribing warning. The fixture filtered client-side; delegating it means
 * the banner and the prescribing gate cannot disagree about what counts.
 */
export async function listAllergies(patientId: string): Promise<Allergy[]> {
  return api<Allergy[]>(`/allergies/patients/${patientId}`);
}
