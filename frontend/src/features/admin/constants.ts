import type { ModuleCode, RealmRole } from "./types";

/** Mock session admin for maker-checker demos (users.id). */
export const MOCK_SESSION_ADMIN_USER_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1";
/** Second admin used as approver (≠ requester). */
export const MOCK_APPROVER_USER_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2";

export const FACILITY_ID = "fac-0001";

export const MODULE_CODES: ModuleCode[] = [
  "lab",
  "radiology",
  "pharmacy",
  "inventory",
  "ipd",
  "ot",
  "blood_bank",
  "emergency",
  "patient_portal",
  "abdm",
  "billing_refunds",
];

export const MODULE_CODE_LABELS: Record<ModuleCode, string> = {
  lab: "Lab",
  radiology: "Radiology",
  pharmacy: "Pharmacy",
  inventory: "Inventory",
  ipd: "IPD",
  ot: "OT",
  blood_bank: "Blood bank",
  emergency: "Emergency",
  patient_portal: "Patient portal",
  abdm: "ABDM",
  billing_refunds: "Billing refunds",
};

/** Core modules that can never be disabled (schema text — display legend only). */
export const CORE_ALWAYS_ON_MODULES = [
  "patients",
  "registration",
  "encounters/opd",
  "queue",
  "departments",
  "billing",
  "consent",
  "audit",
  "files",
  "users",
  "notifications",
] as const;

export const REALM_ROLES: RealmRole[] = [
  "receptionist",
  "doctor",
  "nurse",
  "lab_tech",
  "radiology_tech",
  "pharmacist",
  "emergency",
  "supervisor",
  "admin",
  "auditor",
  "patient",
  "superadmin",
];

export const REALM_ROLE_LABELS: Record<RealmRole, string> = {
  receptionist: "Receptionist",
  doctor: "Doctor",
  nurse: "Nurse",
  lab_tech: "Lab tech",
  radiology_tech: "Radiology tech",
  pharmacist: "Pharmacist",
  emergency: "Emergency",
  supervisor: "Supervisor",
  admin: "Admin",
  auditor: "Auditor",
  patient: "Patient",
  superadmin: "Superadmin",
};

/**
 * Read-only reference: realm role × ModuleCode (and core clinical).
 * Derived only from role names + module codes in the schema — not a DB ACL table.
 * Authz remains Keycloak.
 */
export type MatrixCapability =
  | ModuleCode
  | "patients"
  | "registration"
  | "opd"
  | "queue"
  | "billing"
  | "consent"
  | "audit"
  | "users";

export const MATRIX_CAPABILITIES: MatrixCapability[] = [
  "patients",
  "registration",
  "opd",
  "queue",
  "billing",
  "lab",
  "radiology",
  "pharmacy",
  "inventory",
  "ipd",
  "ot",
  "blood_bank",
  "emergency",
  "consent",
  "audit",
  "users",
  "abdm",
  "billing_refunds",
  "patient_portal",
];

export const MATRIX_CAPABILITY_LABELS: Record<MatrixCapability, string> = {
  patients: "Patients",
  registration: "Registration",
  opd: "OPD",
  queue: "Queue",
  billing: "Billing",
  lab: "Lab",
  radiology: "Radiology",
  pharmacy: "Pharmacy",
  inventory: "Inventory",
  ipd: "IPD",
  ot: "OT",
  blood_bank: "Blood",
  emergency: "Emergency",
  consent: "Consent",
  audit: "Audit",
  users: "Users",
  abdm: "ABDM",
  billing_refunds: "Refunds",
  patient_portal: "Portal",
};

/** Which ModuleCode / core areas each realm role typically touches (reference only). */
export const ROLE_CAPABILITY_MAP: Record<RealmRole, MatrixCapability[]> = {
  receptionist: ["patients", "registration", "opd", "queue", "billing"],
  doctor: ["patients", "registration", "opd", "queue", "lab", "radiology", "pharmacy", "ipd", "ot", "emergency"],
  nurse: ["patients", "opd", "ipd", "emergency", "pharmacy"],
  lab_tech: ["patients", "lab"],
  radiology_tech: ["patients", "radiology"],
  pharmacist: ["patients", "pharmacy", "inventory"],
  emergency: ["patients", "registration", "emergency", "opd"],
  supervisor: ["patients", "registration", "opd", "queue", "billing", "lab", "radiology", "pharmacy", "ipd", "audit"],
  admin: ["users", "billing", "billing_refunds", "inventory", "abdm", "patient_portal", "audit", "consent"],
  auditor: ["audit", "consent", "billing"],
  patient: ["patient_portal"],
  superadmin: ["users", "abdm", "audit"],
};

export const APPROVAL_STATUS_LABELS: Record<"pending" | "approved" | "rejected", string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};
