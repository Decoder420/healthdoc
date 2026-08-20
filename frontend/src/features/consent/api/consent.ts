/**
 * Consent mock API — mirrors BE:
 * GET  /consent/purposes
 * GET  /consent/patients/{patient_id}/records
 * GET  /consent/patients/{patient_id}/records/{consent_id}
 * POST /consent/patients/{patient_id}/records
 * PATCH /consent/records/{consent_id}/status
 * POST /consent/records/{consent_id}/withdraw
 */

import {
  getConsentStore,
  getDataAccessStore,
  getPurposeStore,
  setConsentStore,
} from "@/lib/mock/consent_data";
import { PURPOSE_LABELS } from "../constants";
import type {
  ConsentListFilters,
  ConsentPurpose,
  ConsentRecord,
  ConsentRecordCreate,
  ConsentStatusTransitionIn,
  ConsentWithdrawalCreate,
  DataAccessFilters,
  DataAccessLog,
} from "../types";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `con-${Date.now()}`;
}

function withPurposeLabels(row: ConsentRecord): ConsentRecord {
  const purpose = getPurposeStore().find((p) => p.id === row.purpose_id);
  return {
    ...row,
    purpose_code: purpose?.purpose_code,
    purpose_label: purpose
      ? PURPOSE_LABELS[purpose.purpose_code] ?? purpose.purpose_code
      : row.purpose_label,
  };
}

/** Append-only ledger — mutations must fail. */
export async function attemptMutateDataAccessLog(): Promise<never> {
  await delay(null, 80);
  throw new Error("Append-only: UPDATE/DELETE rejected on data_access_log");
}

/** GET /consent/purposes */
export async function listConsentPurposes(): Promise<ConsentPurpose[]> {
  return delay(getPurposeStore().filter((p) => p.is_active));
}

/**
 * List consents. Prefer patient_id (BE path). Without it, mock returns all
 * (facility console convenience until patient picker exists).
 */
export async function listConsentRecords(
  filters: ConsentListFilters = {},
): Promise<ConsentRecord[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "all";
  let rows = getConsentStore();
  if (filters.patient_id) {
    rows = rows.filter((r) => r.patient_id === filters.patient_id);
  }
  if (status !== "all") {
    rows = rows.filter((r) => r.status === status);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [
        r.id,
        r.patient_id,
        r.purpose_code,
        r.patient?.name,
        r.patient?.uhid,
        r.purpose_label,
        r.channel,
        r.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  rows = [...rows]
    .map(withPurposeLabels)
    .sort(
      (a, b) => new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime(),
    );
  return delay(rows);
}

export async function getConsent(id: string): Promise<ConsentRecord | null> {
  const found = getConsentStore().find((r) => r.id === id);
  return delay(found ? withPurposeLabels(found) : null);
}

/** POST /consent/patients/{patient_id}/records */
export async function createConsentRecord(
  patientId: string,
  body: ConsentRecordCreate,
): Promise<ConsentRecord> {
  const purpose = getPurposeStore().find((p) => p.id === body.purpose_id);
  if (!purpose || !purpose.is_active) throw new Error("Unknown or inactive purpose");

  const now = new Date().toISOString();
  const status = body.status ?? "granted";
  const row: ConsentRecord = withPurposeLabels({
    id: newId(),
    patient_id: patientId,
    visit_id: body.visit_id ?? null,
    purpose_id: body.purpose_id,
    granted_by_type: body.granted_by_type,
    granted_by_user_id: body.granted_by_user_id ?? null,
    guardian_name: body.guardian_name ?? null,
    guardian_relationship: body.guardian_relationship ?? null,
    granted_at: now,
    expires_at: body.expires_at ?? null,
    scope: body.scope ?? null,
    channel: body.channel,
    consent_artefact_id: body.consent_artefact_id ?? null,
    consent_artefact_signature: body.consent_artefact_signature ?? null,
    status,
    status_changed_at: now,
    created_by: body.granted_by_user_id ?? "00000000-0000-4000-8000-000000000210",
    updated_by: null,
    created_at: now,
    updated_at: now,
  });

  setConsentStore([row, ...getConsentStore()]);
  return delay(row);
}

/** PATCH /consent/records/{consent_id}/status — requested → granted|denied only */
export async function transitionConsentStatus(
  consentId: string,
  body: ConsentStatusTransitionIn,
): Promise<ConsentRecord> {
  const store = getConsentStore();
  const idx = store.findIndex((r) => r.id === consentId);
  if (idx < 0) throw new Error("Consent not found");
  const current = store[idx];
  if (current.status !== "requested") {
    throw new Error("Only requested consents can transition via status PATCH");
  }
  const now = new Date().toISOString();
  const next: ConsentRecord = withPurposeLabels({
    ...current,
    status: body.status,
    status_changed_at: now,
    updated_at: now,
  });
  const copy = [...store];
  copy[idx] = next;
  setConsentStore(copy);
  return delay(next);
}

/** POST /consent/records/{consent_id}/withdraw → revoked */
export async function withdrawConsent(
  consentId: string,
  body: ConsentWithdrawalCreate,
): Promise<ConsentRecord> {
  void body;
  const store = getConsentStore();
  const idx = store.findIndex((r) => r.id === consentId);
  if (idx < 0) throw new Error("Consent not found");
  const current = store[idx];
  if (current.status !== "granted") {
    throw new Error("Only granted consents can be withdrawn");
  }
  const now = new Date().toISOString();
  const next: ConsentRecord = withPurposeLabels({
    ...current,
    status: "revoked",
    status_changed_at: now,
    updated_at: now,
  });
  const copy = [...store];
  copy[idx] = next;
  setConsentStore(copy);
  return delay(next);
}

export async function listDataAccessLogs(
  filters: DataAccessFilters = {},
): Promise<DataAccessLog[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  let rows = getDataAccessStore();
  if (filters.consent_id) {
    rows = rows.filter((r) => r.consent_id === filters.consent_id);
  }
  if (filters.patient_id) {
    rows = rows.filter((r) => r.patient_id === filters.patient_id);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [
        r.id,
        r.user_id,
        r.user_display,
        r.resource_type,
        r.purpose_code,
        r.access_channel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  rows = [...rows].sort(
    (a, b) => new Date(b.accessed_at).getTime() - new Date(a.accessed_at).getTime(),
  );
  return delay(rows);
}
