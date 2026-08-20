import type {
  AuditIntegrityCheck,
  AuditLog,
  AuditLogArchive,
  AuditLogFilters,
  AuditLogListResponse,
  DataAccessFilters,
  DataAccessLog,
  FileAccessFilters,
  FileAccessLog,
} from "../types";
import {
  getArchiveStore,
  getAuditStore,
  getAuditDataAccessStore,
  getFileAccessStore,
  getIntegrityStore,
} from "@/lib/mock/audit_data";

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

/** Documents trg_audit_logs_block_update — never succeeds. */
export async function attemptMutateAuditLog(): Promise<never> {
  await delay(null, 80);
  throw new Error("Append-only: UPDATE/DELETE rejected (trg_audit_logs_block_update)");
}

function filterAuditLogs(filters: AuditLogFilters): AuditLog[] {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const action = filters.action ?? "all";
  const resource_type = filters.resource_type ?? "all";

  let rows = getAuditStore();
  if (action !== "all") {
    rows = rows.filter((r) => r.action === action);
  }
  if (resource_type !== "all") {
    rows = rows.filter((r) => r.resource_type === resource_type);
  }
  if (filters.user_id) {
    rows = rows.filter((r) => r.user_id === filters.user_id);
  }
  if (filters.patient_id) {
    rows = rows.filter((r) => r.patient_id === filters.patient_id);
  }
  if (filters.from) {
    const from = new Date(filters.from).getTime();
    rows = rows.filter((r) => new Date(r.created_at).getTime() >= from);
  }
  if (filters.to) {
    const to = new Date(filters.to).getTime();
    rows = rows.filter((r) => new Date(r.created_at).getTime() <= to);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [
        r.id,
        r.action,
        r.resource_type,
        r.resource_id,
        r.patient_id,
        r.user_id,
        r.user_display,
        r.patient_display,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  return [...rows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

/** GET /audit/logs — paginated AuditLogListOut */
export async function listAuditLogs(
  filters: AuditLogFilters = {},
): Promise<AuditLogListResponse> {
  const page = filters.page ?? 1;
  const page_size = Math.min(filters.page_size ?? 100, 100);
  const rows = filterAuditLogs(filters);
  const total = rows.length;
  const start = (page - 1) * page_size;
  const items = rows.slice(start, start + page_size);
  return delay({ items, page, page_size, total });
}

export async function getAuditEntry(
  id: string,
  created_at: string,
): Promise<AuditLog | null> {
  const found = getAuditStore().find((r) => r.id === id && r.created_at === created_at);
  return delay(found ?? null);
}

/** GET /audit/logs/export — CSV stream (mock returns string). */
export async function exportAuditLogsCsv(
  filters: AuditLogFilters = {},
): Promise<string> {
  const rows = filterAuditLogs(filters);
  const header = [
    "id",
    "user_id",
    "role",
    "action",
    "resource_type",
    "resource_id",
    "patient_id",
    "created_at",
    "entry_hash",
  ].join(",");
  const lines = rows.map((r) =>
    [
      r.id,
      r.user_id ?? "",
      r.role ?? "",
      r.action,
      r.resource_type,
      r.resource_id ?? "",
      r.patient_id ?? "",
      r.created_at,
      r.entry_hash ?? "",
    ]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(","),
  );
  return delay([header, ...lines].join("\n"));
}

/**
 * Schema-ahead: GET /audit/access-log (not on live BE yet).
 * Kept for UI tab; swap when B7 ships the route.
 */
export async function listDataAccessLogs(
  filters: DataAccessFilters = {},
): Promise<DataAccessLog[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const channel = filters.access_channel ?? "all";
  let rows = getAuditDataAccessStore();
  if (channel !== "all") {
    rows = rows.filter((r) => r.access_channel === channel);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [
        r.id,
        r.user_id,
        r.user_display,
        r.role,
        r.resource_type,
        r.resource_id,
        r.patient_id,
        r.patient_display,
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

/** Schema-ahead — file_access_log (0019); no dedicated audit export route yet. */
export async function listFileAccessLogs(
  filters: FileAccessFilters = {},
): Promise<FileAccessLog[]> {
  const q = filters.query?.trim().toLowerCase() ?? "";
  const action = filters.action ?? "all";
  let rows = getFileAccessStore();
  if (action !== "all") {
    rows = rows.filter((r) => r.action === action);
  }
  if (q) {
    rows = rows.filter((r) => {
      const hay = [r.id, r.file_id, r.file_name, r.user_id, r.user_display, r.action]
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

/** Schema-ahead: GET /audit/integrity */
export async function listIntegrityChecks(): Promise<AuditIntegrityCheck[]> {
  const rows = [...getIntegrityStore()].sort(
    (a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime(),
  );
  return delay(rows);
}

export async function listArchives(): Promise<AuditLogArchive[]> {
  const rows = [...getArchiveStore()].sort(
    (a, b) => new Date(b.archived_at).getTime() - new Date(a.archived_at).getTime(),
  );
  return delay(rows);
}
