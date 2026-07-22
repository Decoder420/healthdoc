import type {
  ConsentListFilters,
  ConsentRecord,
  DataAccessFilters,
  DataAccessLog,
} from "../types";
import { getConsentStore, getDataAccessStore } from "@/lib/mock/consent_data";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** Append-only ledger — mutations must fail. */
export async function attemptMutateDataAccessLog(): Promise<never> {
  await delay(null, 80);
  throw new Error("Append-only: UPDATE/DELETE rejected on data_access_log");
}

export async function listConsentRecords(
  filters: ConsentListFilters = {},
): Promise<ConsentRecord[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "all";
  let rows = getConsentStore();
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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  rows = [...rows].sort(
    (a, b) => new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime(),
  );
  return delay(rows);
}

export async function getConsent(id: string): Promise<ConsentRecord | null> {
  const found = getConsentStore().find((r) => r.id === id);
  return delay(found ?? null);
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
