/** Audit DTOs aligned to migrations 0003 (audit) + 0019 (file_access_log). */

export type AuditAction =
  | "create"
  | "update"
  | "merge"
  | "login"
  | "logout"
  | "view"
  | "export"
  | "delete_attempt";

export type VerificationStatus = "pending" | "verified" | "failed";

export type FileAccessAction = "view" | "download" | "upload" | "delete_attempt";

export type AuditLog = {
  id: string;
  created_at: string;
  facility_id: string;
  user_id: string | null;
  role: string | null;
  department_id: string | null;
  action: AuditAction | string;
  resource_type: string;
  resource_id: string | null;
  patient_id: string | null;
  visit_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  reason: string | null;
  ip_address: string | null;
  device_id: string | null;
  prev_hash: string | null;
  entry_hash: string;
  signature: string;
  signer_key_id: string;
  /** Display helpers (not DB columns) */
  user_display?: string;
  patient_display?: string;
};

export type AuditLogArchive = {
  id: string;
  facility_id: string;
  partition_name: string;
  period_start: string;
  period_end: string;
  row_count: number;
  object_storage_bucket: string;
  object_storage_key: string;
  archive_file_hash: string;
  archived_at: string;
  verified_at: string | null;
  verification_status: VerificationStatus;
};

export type AuditIntegrityCheck = {
  id: string;
  facility_id: string;
  partition_name: string;
  checked_at: string;
  rows_checked: number;
  chain_valid: boolean;
  signatures_valid: number;
  signatures_invalid: number;
  first_mismatch_id: string | null;
  alerted: boolean;
};

export type FileAccessLog = {
  id: string;
  file_id: string;
  user_id: string;
  action: FileAccessAction;
  ip_address: string | null;
  accessed_at: string;
  user_display?: string;
  file_name?: string;
};

export type AuditLogFilters = {
  query?: string;
  action?: string | "all";
  resource_type?: string | "all";
  from?: string;
  to?: string;
};

export type FileAccessFilters = {
  query?: string;
  action?: FileAccessAction | "all";
};
