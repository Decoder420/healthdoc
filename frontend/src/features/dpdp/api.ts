/**
 * DPDP governance reads and writes.
 *
 * Role gates differ per operation and the screen follows them rather than
 * showing everything and letting the server refuse:
 *
 *   appoint / deactivate a DPO      admin
 *   read the DPO and its history    admin, auditor
 *   raise a grievance               admin, auditor, receptionist
 *   read / transition a grievance   admin, auditor
 *   consent managers (all)          admin
 *
 * Receptionist can RAISE a grievance but not read the queue — front desk is
 * where a patient complains, and the register is the DPO's to work.
 */
import { api, newIdempotencyKey } from "@/lib/api";

import type {
  AppointDpoInput,
  ConsentManager,
  Dpo,
  Grievance,
  GrievanceStatus,
  GrievanceTransitionInput,
  RaiseGrievanceInput,
  RegisterConsentManagerInput,
  UpdateConsentManagerInput,
} from "./types";

/* ---------------------------------------------------------------- the DPO */

/** The sitting DPO. 404 when the facility has never appointed one — which is
 *  itself the answer the screen needs to show. */
export function getActiveDpo(): Promise<Dpo> {
  return api<Dpo>("/dpdp/dpo");
}

/** Every appointment, current and past. Succession is a matter of record. */
export function listDpoHistory(): Promise<Dpo[]> {
  return api<Dpo[]>("/dpdp/dpo/history");
}

export function appointDpo(input: AppointDpoInput): Promise<Dpo> {
  return api<Dpo>("/dpdp/dpo", {
    method: "POST",
    body: JSON.stringify(input),
    idempotencyKey: newIdempotencyKey(),
  });
}

/**
 * Stand a DPO down.
 *
 * Deactivation, not deletion: who held the role and when is exactly what an
 * assessor asks about, and a facility with no active DPO is a state that should
 * be visible rather than one that looks like it never had one.
 */
export function deactivateDpo(dpoId: string): Promise<Dpo> {
  return api<Dpo>(`/dpdp/dpo/${dpoId}/deactivate`, {
    method: "POST",
    body: JSON.stringify({}),
    idempotencyKey: newIdempotencyKey(),
  });
}

/* ------------------------------------------------------------ grievances */

export async function listGrievances(status?: GrievanceStatus): Promise<Grievance[]> {
  const params = new URLSearchParams({ page: "1", page_size: "50" });
  if (status) params.set("status", status);
  const response = await api<{ items: Grievance[] }>(
    `/dpdp/grievances?${params.toString()}`,
  );
  return response.items;
}

export function raiseGrievance(input: RaiseGrievanceInput): Promise<Grievance> {
  return api<Grievance>("/dpdp/grievances", {
    method: "POST",
    body: JSON.stringify(input),
    idempotencyKey: newIdempotencyKey(),
  });
}

/**
 * Move a grievance along: under_review, resolved, escalated_dpb, closed.
 *
 * `escalated_dpb` is escalation to the Data Protection Board — a regulator, not
 * an internal queue. The form asks for a reason on that transition specifically,
 * because "why was this escalated" is the first question anyone will have.
 */
export function transitionGrievance(
  grievanceId: string,
  input: GrievanceTransitionInput,
): Promise<Grievance> {
  return api<Grievance>(`/dpdp/grievances/${grievanceId}/transition`, {
    method: "POST",
    body: JSON.stringify(input),
    idempotencyKey: newIdempotencyKey(),
  });
}

/* ------------------------------------------------------ consent managers */

export async function listConsentManagers(): Promise<ConsentManager[]> {
  const response = await api<{ items: ConsentManager[] }>("/dpdp/consent-managers");
  return response.items;
}

export function registerConsentManager(
  input: RegisterConsentManagerInput,
): Promise<ConsentManager> {
  return api<ConsentManager>("/dpdp/consent-managers", {
    method: "POST",
    body: JSON.stringify(input),
    idempotencyKey: newIdempotencyKey(),
  });
}

export function updateConsentManager(
  managerId: string,
  input: UpdateConsentManagerInput,
): Promise<ConsentManager> {
  return api<ConsentManager>(`/dpdp/consent-managers/${managerId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
    idempotencyKey: null, // PATCH is not idempotency-keyed on this endpoint
  });
}
