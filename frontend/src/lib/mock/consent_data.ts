import { PURPOSE_LABELS } from "@/features/consent/constants";
import type {
  ConsentPurpose,
  ConsentRecord,
  DataAccessLog,
} from "@/features/consent/types";

const PURP_TREAT = "aaaaaaaa-aaaa-4aaa-8aaa-000000000001";
const PURP_PAY = "aaaaaaaa-aaaa-4aaa-8aaa-000000000002";
const PURP_RES = "aaaaaaaa-aaaa-4aaa-8aaa-000000000003";
const PURP_CARE = "aaaaaaaa-aaaa-4aaa-8aaa-000000000004";

const PAT1 = "30000000-0000-4000-8000-000000000001";
const PAT2 = "30000000-0000-4000-8000-000000000002";
const PAT3 = "30000000-0000-4000-8000-000000000003";
const USR_DOC = "00000000-0000-4000-8000-000000000210";

export const MOCK_CONSENT_PURPOSES: ConsentPurpose[] = [
  {
    id: PURP_TREAT,
    purpose_code: "TREATMENT",
    description: "Clinical treatment and care delivery",
    default_expiry_days: 365,
    requires_explicit_consent: true,
    is_active: true,
  },
  {
    id: PURP_PAY,
    purpose_code: "PAYMENT",
    description: "Billing and claims",
    default_expiry_days: null,
    requires_explicit_consent: true,
    is_active: true,
  },
  {
    id: PURP_RES,
    purpose_code: "RESEARCH",
    description: "De-identified research",
    default_expiry_days: 365,
    requires_explicit_consent: true,
    is_active: true,
  },
  {
    id: PURP_CARE,
    purpose_code: "CARE_MANAGEMENT",
    description: "Care coordination",
    default_expiry_days: 180,
    requires_explicit_consent: true,
    is_active: true,
  },
];

function enrich(
  row: Omit<ConsentRecord, "purpose_code" | "purpose_label" | "patient"> & {
    patient?: ConsentRecord["patient"];
  },
): ConsentRecord {
  const purpose = MOCK_CONSENT_PURPOSES.find((p) => p.id === row.purpose_id);
  return {
    ...row,
    purpose_code: purpose?.purpose_code,
    purpose_label: purpose
      ? PURPOSE_LABELS[purpose.purpose_code] ?? purpose.purpose_code
      : undefined,
  };
}

const SEED_CONSENTS: ConsentRecord[] = [
  enrich({
    id: "con-001",
    patient_id: PAT1,
    visit_id: "20000000-0000-4000-8000-000000000001",
    purpose_id: PURP_TREAT,
    granted_by_type: "patient",
    granted_by_user_id: null,
    guardian_name: null,
    guardian_relationship: null,
    granted_at: "2026-06-01T10:00:00.000Z",
    expires_at: "2027-06-01T00:00:00.000Z",
    scope: ["encounters", "lab_results"],
    channel: "written",
    consent_artefact_id: null,
    consent_artefact_signature: null,
    status: "granted",
    status_changed_at: "2026-06-01T10:00:00.000Z",
    created_by: USR_DOC,
    updated_by: null,
    created_at: "2026-06-01T10:00:00.000Z",
    updated_at: "2026-06-01T10:00:00.000Z",
    patient: { uhid: "UHID-1001", name: "Anita Sharma" },
  }),
  enrich({
    id: "con-002",
    patient_id: PAT1,
    visit_id: null,
    purpose_id: PURP_PAY,
    granted_by_type: "patient",
    granted_by_user_id: null,
    guardian_name: null,
    guardian_relationship: null,
    granted_at: "2026-07-01T08:20:00.000Z",
    expires_at: null,
    scope: ["invoices", "payments"],
    channel: "digital_otp",
    consent_artefact_id: null,
    consent_artefact_signature: null,
    status: "granted",
    status_changed_at: "2026-07-01T08:20:00.000Z",
    created_by: USR_DOC,
    updated_by: null,
    created_at: "2026-07-01T08:20:00.000Z",
    updated_at: "2026-07-01T08:20:00.000Z",
    patient: { uhid: "UHID-1001", name: "Anita Sharma" },
  }),
  enrich({
    id: "con-003",
    patient_id: PAT2,
    visit_id: null,
    purpose_id: PURP_TREAT,
    granted_by_type: "patient",
    granted_by_user_id: null,
    guardian_name: null,
    guardian_relationship: null,
    granted_at: "2026-05-15T11:30:00.000Z",
    expires_at: "2026-11-15T00:00:00.000Z",
    scope: null,
    channel: "verbal",
    consent_artefact_id: null,
    consent_artefact_signature: null,
    status: "granted",
    status_changed_at: "2026-05-15T11:30:00.000Z",
    created_by: USR_DOC,
    updated_by: null,
    created_at: "2026-05-15T11:30:00.000Z",
    updated_at: "2026-05-15T11:30:00.000Z",
    patient: { uhid: "UHID-1002", name: "Rahul Verma" },
  }),
  enrich({
    id: "con-004",
    patient_id: PAT2,
    visit_id: null,
    purpose_id: PURP_RES,
    granted_by_type: "patient",
    granted_by_user_id: null,
    guardian_name: null,
    guardian_relationship: null,
    granted_at: "2026-01-01T09:00:00.000Z",
    expires_at: "2026-12-31T00:00:00.000Z",
    scope: ["deidentified"],
    channel: "written",
    consent_artefact_id: null,
    consent_artefact_signature: null,
    status: "revoked",
    status_changed_at: "2026-04-20T14:00:00.000Z",
    created_by: USR_DOC,
    updated_by: USR_DOC,
    created_at: "2026-01-01T09:00:00.000Z",
    updated_at: "2026-04-20T14:00:00.000Z",
    patient: { uhid: "UHID-1002", name: "Rahul Verma" },
  }),
  enrich({
    id: "con-005",
    patient_id: PAT3,
    visit_id: null,
    purpose_id: PURP_CARE,
    granted_by_type: "guardian",
    granted_by_user_id: null,
    guardian_name: "Ramesh Patel",
    guardian_relationship: "father",
    granted_at: "2025-01-01T12:00:00.000Z",
    expires_at: "2026-01-01T00:00:00.000Z",
    scope: null,
    channel: "written",
    consent_artefact_id: null,
    consent_artefact_signature: null,
    status: "expired",
    status_changed_at: "2026-01-01T00:00:00.000Z",
    created_by: USR_DOC,
    updated_by: null,
    created_at: "2025-01-01T12:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    patient: { uhid: "UHID-1003", name: "Sneha Patel" },
  }),
  enrich({
    id: "con-006",
    patient_id: PAT3,
    visit_id: null,
    purpose_id: PURP_TREAT,
    granted_by_type: "patient",
    granted_by_user_id: null,
    guardian_name: null,
    guardian_relationship: null,
    granted_at: "2026-07-18T09:00:00.000Z",
    expires_at: null,
    scope: null,
    channel: "abdm_consent_manager",
    consent_artefact_id: "artefact-pending-1",
    consent_artefact_signature: null,
    status: "requested",
    status_changed_at: "2026-07-18T09:00:00.000Z",
    created_by: USR_DOC,
    updated_by: null,
    created_at: "2026-07-18T09:00:00.000Z",
    updated_at: "2026-07-18T09:00:00.000Z",
    patient: { uhid: "UHID-1003", name: "Sneha Patel" },
  }),
];

const SEED_ACCESS: DataAccessLog[] = [
  {
    id: "dal-001",
    accessed_at: "2026-07-02T10:05:00.000Z",
    consent_id: "con-001",
    user_id: "usr-210",
    role: "doctor",
    resource_type: "visits",
    resource_id: "vis-2001",
    patient_id: PAT1,
    purpose_code: "TREATMENT",
    access_channel: "ui",
    emergency_access: false,
    consent_required: true,
    consent_verified: true,
    user_display: "Dr. K. Iyer",
  },
  {
    id: "dal-002",
    accessed_at: "2026-07-03T11:22:00.000Z",
    consent_id: "con-001",
    user_id: "usr-210",
    role: "doctor",
    resource_type: "lab_orders",
    resource_id: "lab-4401",
    patient_id: PAT1,
    purpose_code: "TREATMENT",
    access_channel: "ui",
    emergency_access: false,
    consent_required: true,
    consent_verified: true,
    user_display: "Dr. K. Iyer",
  },
  {
    id: "dal-003",
    accessed_at: "2026-07-06T22:15:00.000Z",
    consent_id: "con-001",
    user_id: "usr-220",
    role: "emergency",
    resource_type: "patients",
    resource_id: PAT1,
    patient_id: PAT1,
    purpose_code: "TREATMENT",
    access_channel: "ui",
    emergency_access: true,
    consent_required: true,
    consent_verified: false,
    user_display: "Dr. E. Khan (ER)",
  },
  {
    id: "dal-004",
    accessed_at: "2026-07-08T14:40:00.000Z",
    consent_id: "con-002",
    user_id: "usr-400",
    role: "receptionist",
    resource_type: "invoices",
    resource_id: "10000000-0000-4000-8000-000000000001",
    patient_id: PAT1,
    purpose_code: "PAYMENT",
    access_channel: "ui",
    emergency_access: false,
    consent_required: true,
    consent_verified: true,
    user_display: "P. Joshi",
  },
  {
    id: "dal-005",
    accessed_at: "2026-07-10T09:00:00.000Z",
    consent_id: "con-003",
    user_id: "usr-310",
    role: "lab_tech",
    resource_type: "lab_orders",
    resource_id: "lab-4401",
    patient_id: PAT2,
    purpose_code: "TREATMENT",
    access_channel: "api",
    emergency_access: false,
    consent_required: true,
    consent_verified: true,
    user_display: "S. Nair",
  },
  {
    id: "dal-006",
    accessed_at: "2026-07-11T16:30:00.000Z",
    consent_id: "con-003",
    user_id: "usr-900",
    role: "auditor",
    resource_type: "patients",
    resource_id: PAT2,
    patient_id: PAT2,
    purpose_code: "TREATMENT",
    access_channel: "abdm_hiu",
    emergency_access: false,
    consent_required: true,
    consent_verified: true,
    user_display: "ABDM HIU bridge",
  },
  {
    id: "dal-007",
    accessed_at: "2026-03-01T12:00:00.000Z",
    consent_id: "con-004",
    user_id: "usr-050",
    role: "admin",
    resource_type: "patients",
    resource_id: PAT2,
    patient_id: PAT2,
    purpose_code: "RESEARCH",
    access_channel: "export",
    emergency_access: false,
    consent_required: true,
    consent_verified: true,
    user_display: "A. Choudhary",
  },
  {
    id: "dal-008",
    accessed_at: "2026-07-12T08:00:00.000Z",
    consent_id: null,
    user_id: "usr-050",
    role: "admin",
    resource_type: "patients",
    resource_id: PAT3,
    patient_id: PAT3,
    purpose_code: null,
    access_channel: "ui",
    emergency_access: false,
    consent_required: false,
    consent_verified: false,
    user_display: "A. Choudhary",
  },
];

let consentStore = structuredClone(SEED_CONSENTS);
let accessStore = structuredClone(SEED_ACCESS);
let purposeStore = structuredClone(MOCK_CONSENT_PURPOSES);

export function getConsentStore(): ConsentRecord[] {
  return consentStore;
}

export function setConsentStore(next: ConsentRecord[]) {
  consentStore = next;
}

export function getDataAccessStore(): DataAccessLog[] {
  return accessStore;
}

export function getPurposeStore(): ConsentPurpose[] {
  return purposeStore;
}

export function resetConsentMock() {
  consentStore = structuredClone(SEED_CONSENTS);
  accessStore = structuredClone(SEED_ACCESS);
  purposeStore = structuredClone(MOCK_CONSENT_PURPOSES);
}
