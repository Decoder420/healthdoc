import { api } from "@/lib/api";

import type {
  Patient,
  PatientCreate,
  PatientSearchRequest,
  PatientSearchResponse,
} from "./types";

/**
 * Register a patient.
 *
 * `idempotencyKey` is generated once when the form opens, not per submit, and
 * that is the whole point: a receptionist who double-clicks, or whose network
 * drops after the server committed, must not create a second chart for the same
 * person. The server reserves the key before doing any work and replays the
 * stored response, so a retry returns the original patient with the original
 * UHID rather than allocating a new one.
 */
export function registerPatient(
  payload: PatientCreate,
  idempotencyKey: string,
): Promise<Patient> {
  return api<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

/** At least one criterion is required — the server rejects an empty search. */
export function searchPatients(
  criteria: PatientSearchRequest,
): Promise<PatientSearchResponse> {
  return api<PatientSearchResponse>("/patients/search", {
    method: "POST",
    // A search is a POST because the criteria include Aadhaar and ABHA numbers,
    // which must not end up in a query string, a browser history entry or an
    // access log.
    body: JSON.stringify({ page: 1, page_size: 20, ...criteria }),
    idempotencyKey: null, // creates nothing
  });
}
