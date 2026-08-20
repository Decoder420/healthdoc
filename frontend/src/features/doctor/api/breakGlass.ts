/**
 * Break-glass emergency access.
 *
 * NONE of these endpoints exist yet. Schema v3.13 §3 0004 defines the
 * break_glass_grants table in full, but §4.4 documents no route that creates,
 * lists or revokes a grant, and no step-up MFA challenge. The proposed routes
 * are named on each function so wiring them up is a one-line change each.
 */
import {
  buildGrant,
  isGrantActive,
  restrictedPatients,
  savedBreakGlassGrants,
} from "@/lib/mock";
import { MFA_CODE_LENGTH, MOCK_PROVIDER_USER_ID } from "../constants";
import type {
  BreakGlassGrant,
  CreateBreakGlassGrantInput,
  RecordAccess,
  StepUpResult,
} from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** This clinician's active grant for a patient, if any. */
function activeGrantFor(patientId: string): BreakGlassGrant | undefined {
  return savedBreakGlassGrants.find(
    (g) =>
      g.patient_id === patientId &&
      g.granted_to_user_id === MOCK_PROVIDER_USER_ID &&
      isGrantActive(g),
  );
}

/**
 * Can this clinician read this patient's record?
 *
 * PROPOSED: there is no endpoint for this. In production the answer arrives as
 * a 403 on the clinical read itself, whose body must name the reason and say
 * that break-glass is available — a contract that does not exist yet.
 */
export async function checkRecordAccess(patientId: string): Promise<RecordAccess> {
  const blocked = restrictedPatients[patientId];
  if (!blocked) return delay({ patient_id: patientId, allowed: true });

  const grant = activeGrantFor(patientId);
  if (grant) return delay({ patient_id: patientId, allowed: true, grant });

  return delay({ patient_id: patientId, allowed: false, blocked_reason: blocked });
}

/**
 * Step-up MFA before a grant is issued.
 *
 * PROPOSED: POST /api/v1/auth/step-up  { code }
 * The schema requires an MFA session (`amr` contains `otp`) for break-glass but
 * does not say whether that is collected inline or via a Keycloak re-auth
 * redirect. If it turns out to be a redirect, this function and the modal's
 * second step are the only things that change.
 *
 * Mock rule: any correctly-shaped code passes except "000000", so the failure
 * path stays exercisable.
 */
export async function verifyStepUp(code: string): Promise<StepUpResult> {
  const trimmed = code.trim();
  if (!new RegExp(`^\\d{${MFA_CODE_LENGTH}}$`).test(trimmed)) {
    return delay({ verified: false, error: `Enter the ${MFA_CODE_LENGTH}-digit code.` }, 120);
  }
  if (trimmed === "0".repeat(MFA_CODE_LENGTH)) {
    return delay({ verified: false, error: "That code is not valid. Try again." }, 400);
  }
  return delay({ verified: true }, 400);
}

/**
 * Open a break-glass grant.
 *
 * PROPOSED: POST /api/v1/break-glass/grants  { patient_id, justification }
 * The server sets granted_to_user_id from the JWT, and owns granted_at and
 * expires_at. Requires a verified step-up session.
 */
export async function requestBreakGlassGrant(
  input: CreateBreakGlassGrantInput,
): Promise<BreakGlassGrant> {
  const grant = buildGrant({
    patient_id: input.patient_id,
    justification: input.justification.trim(),
    granted_to_user_id: MOCK_PROVIDER_USER_ID,
  });
  savedBreakGlassGrants.push(grant);
  return delay(grant);
}

/**
 * Close a grant early. A grant is active iff now() < expires_at AND
 * revoked_at IS NULL, so revoking is how a clinician gives access back before
 * the window runs out.
 *
 * PROPOSED: POST /api/v1/break-glass/grants/{id}/revoke
 */
export async function revokeBreakGlassGrant(grantId: string): Promise<BreakGlassGrant | null> {
  const grant = savedBreakGlassGrants.find((g) => g.id === grantId);
  if (!grant) return delay(null);
  grant.revoked_at = new Date().toISOString();
  grant.revoked_by = MOCK_PROVIDER_USER_ID;
  return delay(grant);
}
