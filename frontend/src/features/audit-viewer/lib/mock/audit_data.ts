import { FACILITY_ID } from "../../constants";
import type {
  AuditIntegrityCheck,
  AuditLog,
  AuditLogArchive,
  FileAccessLog,
} from "../../types";

/** Deterministic fake sha256-looking hex (64 chars). */
function h(seed: string): string {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0;
  const hex = (n.toString(16) + "a1b2c3d4e5f67890".repeat(4)).slice(0, 64);
  return hex.padEnd(64, "0");
}

const GENESIS = "0".repeat(64);

const SEED_AUDIT: AuditLog[] = (() => {
  const rows: Omit<AuditLog, "prev_hash" | "entry_hash">[] = [
    {
      id: "aud-001",
      created_at: "2026-07-01T08:12:00+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-100",
      role: "receptionist",
      department_id: "dept-reg",
      action: "create",
      resource_type: "patients",
      resource_id: "pat-1001",
      patient_id: "pat-1001",
      visit_id: null,
      old_value: null,
      new_value: { uhid: "UHID-1001", name: "Anita Sharma" },
      reason: "OPD registration",
      ip_address: "10.0.1.21",
      device_id: "desk-reg-01",
      signature: "ed25519:sig-aud-001",
      signer_key_id: "audit-key-2026-q2",
      user_display: "R. Mehta",
      patient_display: "Anita Sharma",
    },
    {
      id: "aud-002",
      created_at: "2026-07-01T08:15:22+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-100",
      role: "receptionist",
      department_id: "dept-reg",
      action: "create",
      resource_type: "visits",
      resource_id: "vis-2001",
      patient_id: "pat-1001",
      visit_id: "vis-2001",
      old_value: null,
      new_value: { visit_type: "OPD", department: "General Medicine" },
      reason: null,
      ip_address: "10.0.1.21",
      device_id: "desk-reg-01",
      signature: "ed25519:sig-aud-002",
      signer_key_id: "audit-key-2026-q2",
      user_display: "R. Mehta",
      patient_display: "Anita Sharma",
    },
    {
      id: "aud-003",
      created_at: "2026-07-02T10:04:11+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-210",
      role: "doctor",
      department_id: "dept-gm",
      action: "update",
      resource_type: "visits",
      resource_id: "vis-2001",
      patient_id: "pat-1001",
      visit_id: "vis-2001",
      old_value: { status: "waiting" },
      new_value: { status: "in_consultation" },
      reason: null,
      ip_address: "10.0.2.44",
      device_id: "opd-tablet-03",
      signature: "ed25519:sig-aud-003",
      signer_key_id: "audit-key-2026-q2",
      user_display: "Dr. K. Iyer",
      patient_display: "Anita Sharma",
    },
    {
      id: "aud-004",
      created_at: "2026-07-03T11:20:00+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-310",
      role: "lab_tech",
      department_id: "dept-path",
      action: "create",
      resource_type: "lab_orders",
      resource_id: "lab-4401",
      patient_id: "pat-1002",
      visit_id: "vis-2008",
      old_value: null,
      new_value: { tests: ["CBC", "RBS"] },
      reason: null,
      ip_address: "10.0.3.12",
      device_id: "lab-ws-02",
      signature: "ed25519:sig-aud-004",
      signer_key_id: "audit-key-2026-q2",
      user_display: "S. Nair",
      patient_display: "Rahul Verma",
    },
    {
      id: "aud-005",
      created_at: "2026-07-05T09:01:45+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-050",
      role: "admin",
      department_id: null,
      action: "merge",
      resource_type: "patients",
      resource_id: "pat-1003",
      patient_id: "pat-1003",
      visit_id: null,
      old_value: { duplicate_of: "pat-1099" },
      new_value: { survivor: "pat-1003", merged_from: "pat-1099" },
      reason: "Duplicate UHID cleanup",
      ip_address: "10.0.0.5",
      device_id: "admin-laptop",
      signature: "ed25519:sig-aud-005",
      signer_key_id: "audit-key-2026-q2",
      user_display: "A. Choudhary",
      patient_display: "Merged patient",
    },
    {
      id: "aud-006",
      created_at: "2026-07-08T14:33:10+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-400",
      role: "billing_clerk",
      department_id: "dept-billing",
      action: "update",
      resource_type: "invoices",
      resource_id: "inv-001",
      patient_id: "pat-1001",
      visit_id: "vis-2001",
      old_value: { status: "draft", scheme_code: null },
      new_value: { status: "issued", scheme_code: "PM-JAY" },
      reason: "Issue invoice after scheme confirm",
      ip_address: "10.0.4.8",
      device_id: "bill-desk-01",
      signature: "ed25519:sig-aud-006",
      signer_key_id: "audit-key-2026-q2",
      user_display: "P. Joshi",
      patient_display: "Anita Sharma",
    },
    {
      id: "aud-007",
      created_at: "2026-07-10T07:55:00+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-210",
      role: "doctor",
      department_id: "dept-gm",
      action: "login",
      resource_type: "users",
      resource_id: "usr-210",
      patient_id: null,
      visit_id: null,
      old_value: null,
      new_value: { session: "started" },
      reason: null,
      ip_address: "10.0.2.44",
      device_id: "opd-tablet-03",
      signature: "ed25519:sig-aud-007",
      signer_key_id: "audit-key-2026-q2",
      user_display: "Dr. K. Iyer",
    },
    {
      id: "aud-008",
      created_at: "2026-07-12T16:10:30+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-050",
      role: "admin",
      department_id: null,
      action: "export",
      resource_type: "patients",
      resource_id: null,
      patient_id: null,
      visit_id: null,
      old_value: null,
      new_value: { format: "csv", rows: 120 },
      reason: "Monthly quality report",
      ip_address: "10.0.0.5",
      device_id: "admin-laptop",
      signature: "ed25519:sig-aud-008",
      signer_key_id: "audit-key-2026-q2",
      user_display: "A. Choudhary",
    },
    {
      id: "aud-009",
      created_at: "2026-07-15T12:40:00+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-510",
      role: "radiologist",
      department_id: "dept-rad",
      action: "create",
      resource_type: "radiology_orders",
      resource_id: "rad-7701",
      patient_id: "pat-1002",
      visit_id: "vis-2008",
      old_value: null,
      new_value: { modality: "XRAY", body_part: "Chest PA" },
      reason: null,
      ip_address: "10.0.5.19",
      device_id: "rad-ws-01",
      signature: "ed25519:sig-aud-009",
      signer_key_id: "audit-key-2026-q2",
      user_display: "Dr. M. Rao",
      patient_display: "Rahul Verma",
    },
    {
      id: "aud-010",
      created_at: "2026-07-17T18:02:15+05:30",
      facility_id: FACILITY_ID,
      user_id: "usr-050",
      role: "admin",
      department_id: null,
      action: "delete_attempt",
      resource_type: "audit_logs",
      resource_id: "aud-001",
      patient_id: null,
      visit_id: null,
      old_value: null,
      new_value: { blocked: true },
      reason: "Trigger blocked UPDATE/DELETE",
      ip_address: "10.0.0.5",
      device_id: "admin-laptop",
      signature: "ed25519:sig-aud-010",
      signer_key_id: "audit-key-2026-q2",
      user_display: "A. Choudhary",
    },
  ];

  let prev = GENESIS;
  return rows.map((row, i) => {
    const payload = `${prev}|${row.id}|${row.created_at}|${row.action}|${row.resource_type}`;
    const entry_hash = h(payload + String(i));
    const full: AuditLog = {
      ...row,
      prev_hash: prev === GENESIS ? GENESIS : prev,
      entry_hash,
    };
    prev = entry_hash;
    return full;
  });
})();

const SEED_FILE_ACCESS: FileAccessLog[] = [
  {
    id: "fal-001",
    file_id: "file-901",
    user_id: "usr-210",
    action: "view",
    ip_address: "10.0.2.44",
    accessed_at: "2026-07-11T09:20:00+05:30",
    user_display: "Dr. K. Iyer",
    file_name: "discharge_summary_vis-2001.pdf",
  },
  {
    id: "fal-002",
    file_id: "file-901",
    user_id: "usr-210",
    action: "download",
    ip_address: "10.0.2.44",
    accessed_at: "2026-07-11T09:21:12+05:30",
    user_display: "Dr. K. Iyer",
    file_name: "discharge_summary_vis-2001.pdf",
  },
  {
    id: "fal-003",
    file_id: "file-912",
    user_id: "usr-310",
    action: "upload",
    ip_address: "10.0.3.12",
    accessed_at: "2026-07-12T11:05:00+05:30",
    user_display: "S. Nair",
    file_name: "cbc_report_lab-4401.pdf",
  },
  {
    id: "fal-004",
    file_id: "file-920",
    user_id: "usr-050",
    action: "delete_attempt",
    ip_address: "10.0.0.5",
    accessed_at: "2026-07-14T15:00:00+05:30",
    user_display: "A. Choudhary",
    file_name: "legacy_scan.dcm",
  },
  {
    id: "fal-005",
    file_id: "file-930",
    user_id: "usr-510",
    action: "view",
    ip_address: "10.0.5.19",
    accessed_at: "2026-07-16T13:44:00+05:30",
    user_display: "Dr. M. Rao",
    file_name: "chest_pa_rad-7701.dcm",
  },
];

const SEED_INTEGRITY: AuditIntegrityCheck[] = [
  {
    id: "aic-001",
    facility_id: FACILITY_ID,
    partition_name: "audit_logs_2026_06",
    checked_at: "2026-07-01T02:00:00+05:30",
    rows_checked: 48210,
    chain_valid: true,
    signatures_valid: 48210,
    signatures_invalid: 0,
    first_mismatch_id: null,
    alerted: false,
  },
  {
    id: "aic-002",
    facility_id: FACILITY_ID,
    partition_name: "audit_logs_2026_07",
    checked_at: "2026-07-18T02:00:00+05:30",
    rows_checked: 1240,
    chain_valid: false,
    signatures_valid: 1238,
    signatures_invalid: 2,
    first_mismatch_id: "aud-010",
    alerted: true,
  },
];

const SEED_ARCHIVE: AuditLogArchive[] = [
  {
    id: "ala-001",
    facility_id: FACILITY_ID,
    partition_name: "audit_logs_2026_05",
    period_start: "2026-05-01",
    period_end: "2026-05-31",
    row_count: 51002,
    object_storage_bucket: "healthdoc-audit-archive",
    object_storage_key: "fac-0001/2026/05/audit_logs.parquet",
    archive_file_hash: h("archive-2026-05"),
    archived_at: "2026-06-02T04:00:00+05:30",
    verified_at: "2026-06-02T05:10:00+05:30",
    verification_status: "verified",
  },
];

let auditStore: AuditLog[] = structuredClone(SEED_AUDIT);
let fileAccessStore: FileAccessLog[] = structuredClone(SEED_FILE_ACCESS);
let integrityStore: AuditIntegrityCheck[] = structuredClone(SEED_INTEGRITY);
let archiveStore: AuditLogArchive[] = structuredClone(SEED_ARCHIVE);

export function getAuditStore(): AuditLog[] {
  return auditStore;
}

export function getFileAccessStore(): FileAccessLog[] {
  return fileAccessStore;
}

export function getIntegrityStore(): AuditIntegrityCheck[] {
  return integrityStore;
}

export function getArchiveStore(): AuditLogArchive[] {
  return archiveStore;
}

/** Test helper — reset between hot reloads if needed */
export function resetAuditMock() {
  auditStore = structuredClone(SEED_AUDIT);
  fileAccessStore = structuredClone(SEED_FILE_ACCESS);
  integrityStore = structuredClone(SEED_INTEGRITY);
  archiveStore = structuredClone(SEED_ARCHIVE);
}
