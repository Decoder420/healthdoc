/**
 * Week 6 break-glass seed data — stands in for break_glass_grants (schema
 * v3.13 §3 0004) and for the consent check that decides whether a record is
 * readable at all.
 *
 * This file plays the SERVER's part on purpose. The grant TTL and expires_at
 * are computed here, never in the UI, so that swapping in the real endpoints
 * changes no component: the countdown already renders a server timestamp.
 */
import type { BreakGlassGrant, RecordAccessBlockedReason } from "@/features/doctor/types";

/**
 * Grant lifetime. The schema calls this "granted_at + 2h (facility-configurable)"
 * but names no setting to read it from — facility_settings holds only
 * stock_deduction_policy today (raised with B7). Server-side value; the UI must
 * not import it.
 */
const GRANT_TTL_MS = 2 * 60 * 60 * 1000;

/**
 * Patients with no consent record covering this clinician — the break-glass
 * trigger. In production this is decided server-side and surfaced as a 403 on
 * the clinical read; there is no /consent endpoint to ask (see types.ts).
 */
export const restrictedPatients: Record<string, RecordAccessBlockedReason> = {
  "p-1004": "consent_absent",
};

/** Grants created during the mock session (stand-in for the table). */
export const savedBreakGlassGrants: BreakGlassGrant[] = [];

/** Server-side grant construction — expires_at is derived here, not by callers. */
export function buildGrant(input: {
  patient_id: string;
  justification: string;
  granted_to_user_id: string;
}): BreakGlassGrant {
  const grantedAt = new Date();
  return {
    id: crypto.randomUUID(),
    patient_id: input.patient_id,
    granted_to_user_id: input.granted_to_user_id,
    justification: input.justification,
    granted_at: grantedAt.toISOString(),
    expires_at: new Date(grantedAt.getTime() + GRANT_TTL_MS).toISOString(),
  };
}

/** A grant is active iff now() < expires_at AND revoked_at IS NULL (§3 0004). */
export function isGrantActive(grant: BreakGlassGrant, now = Date.now()): boolean {
  return !grant.revoked_at && now < Date.parse(grant.expires_at);
}
