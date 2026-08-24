import { api } from "@/lib/api";

import type {
  Patient,
  PatientCreate,
  PatientSearchRequest,
  PatientSearchResponse,
  QueueSummary,
  QueueToken,
  QueueTokenCreate,
  QueueTokenList,
  Visit,
  VisitCreate,
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

/** Uppercase UHID and strip separators so card printouts match the column. */
function normalizeUhid(value: string): string {
  return value.trim().toUpperCase().replace(/[\s\-_/]/g, "");
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Shape criteria for the wire. UHID is uppercased and separators stripped;
 * mobile / ABHA keep digits only. Aadhaar is a valid server criterion and is
 * deliberately never sent from this UI — see PatientSearch.
 */
export function normalizeSearchCriteria(
  criteria: PatientSearchRequest,
): PatientSearchRequest {
  const next: PatientSearchRequest = {
    page: criteria.page ?? 1,
    page_size: criteria.page_size ?? 20,
  };
  if (criteria.full_name?.trim()) next.full_name = criteria.full_name.trim();
  if (criteria.dob?.trim()) next.dob = criteria.dob.trim();
  if (criteria.uhid?.trim()) next.uhid = normalizeUhid(criteria.uhid);
  if (criteria.mobile?.trim()) {
    const mobile = digitsOnly(criteria.mobile);
    if (mobile) next.mobile = mobile;
  }
  if (criteria.abha_number?.trim()) {
    const abha = digitsOnly(criteria.abha_number);
    if (abha) next.abha_number = abha;
  }
  return next;
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
    body: JSON.stringify(normalizeSearchCriteria(criteria)),
    idempotencyKey: null, // creates nothing
  });
}

/**
 * Open a visit.
 *
 * The registration invoice is raised inside the same server transaction (#389),
 * so this one call is what puts the patient into the billing chain. A retry
 * replays rather than opening a second visit — which would mean a second
 * registration fee.
 */
export function createVisit(
  payload: VisitCreate,
  idempotencyKey: string,
): Promise<Visit> {
  return api<Visit>("/visits", {
    method: "POST",
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

/** Today's queues at the caller's facility, shortest first. */
export function listQueues(): Promise<QueueSummary[]> {
  return api<QueueSummary[]>("/queue/queues");
}

/** Tokens for one queue, with the current now_serving. */
export function listQueueTokens(queueId: string): Promise<QueueTokenList> {
  return api<QueueTokenList>(`/queue/queues/${queueId}/tokens`);
}

/** Issue a token against a visit. Retry-safe for the same reason as the visit. */
export function issueToken(
  payload: QueueTokenCreate,
  idempotencyKey: string,
): Promise<QueueToken> {
  return api<QueueToken>("/queue/tokens", {
    method: "POST",
    body: JSON.stringify({ priority: "normal", ...payload }),
    idempotencyKey,
  });
}
