/** Server-owned consent and emergency-access decisions. */
import { api } from "@/lib/api";
import type {
  BreakGlassGrant,
  CreateBreakGlassGrantInput,
  RecordAccess,
} from "../types";

interface RevokeBreakGlassResponse {
  revoked: true;
  grant_id: string;
}

/** GET /break-glass/access/{patient_id} */
export async function checkRecordAccess(patientId: string): Promise<RecordAccess> {
  return api<RecordAccess>(`/break-glass/access/${patientId}`);
}

/**
 * POST /break-glass
 *
 * Keycloak owns MFA. The API rejects this call unless the bearer token's
 * `amr` claim proves OTP/MFA, and owns every grant identifier and timestamp.
 */
export async function requestBreakGlassGrant(
  input: CreateBreakGlassGrantInput,
): Promise<BreakGlassGrant> {
  return api<BreakGlassGrant>("/break-glass", {
    method: "POST",
    body: JSON.stringify(input),
    // The backend reuses an already-active grant for this clinician/patient.
    idempotencyKey: null,
  });
}

/** POST /break-glass/{grant_id}/revoke */
export async function revokeBreakGlassGrant(grantId: string): Promise<void> {
  await api<RevokeBreakGlassResponse>(`/break-glass/${grantId}/revoke`, {
    method: "POST",
    body: JSON.stringify({
      reason: "Clinician ended emergency access from the patient record.",
    }),
    idempotencyKey: null,
  });
}
