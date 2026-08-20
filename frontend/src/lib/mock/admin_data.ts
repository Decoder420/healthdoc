import type {
  Facility,
  FacilityModule,
  User,
  UserAccountRequest,
} from "@/features/admin/types";
import {
  FACILITY_CODE,
  FACILITY_DISPLAY_NAME,
  FACILITY_ID,
  MOCK_APPROVER_USER_ID,
  MOCK_SESSION_ADMIN_USER_ID,
  MODULE_CODES,
} from "@/features/admin/constants";
import { MOCK_FACILITY_TIMEZONE } from "@/lib/mock/facility";

const now = "2026-07-20T08:00:00Z";

function stamp(iso = now) {
  return { created_at: iso, updated_at: iso };
}

const facilities: Facility[] = [
  {
    id: FACILITY_ID,
    code: FACILITY_CODE,
    name: FACILITY_DISPLAY_NAME,
    state_code: "RJ",
    district: "Jaipur",
    facility_type: "district_hospital",
    hfr_facility_id: null,
    timezone: MOCK_FACILITY_TIMEZONE,
    is_active: true,
    ...stamp(),
  },
];

let users: User[] = [
  {
    id: MOCK_SESSION_ADMIN_USER_ID,
    keycloak_sub: "kc-admin-1",
    username: "admin.jaipur",
    full_name: "Facility Admin",
    email: "admin@healthdoc.local",
    mobile: "+919876543210",
    designation: "Facility Admin",
    employee_id: "EMP-001",
    registration_number: null,
    qualification: null,
    facility_id: FACILITY_ID,
    department_id: null,
    is_active: true,
    ...stamp("2026-07-01T06:00:00Z"),
  },
  {
    id: MOCK_APPROVER_USER_ID,
    keycloak_sub: "kc-admin-2",
    username: "hod.medicine",
    full_name: "Dr. Meera Sharma",
    email: "meera.sharma@healthdoc.local",
    mobile: "+919876543211",
    designation: "HOD Medicine",
    employee_id: "EMP-002",
    registration_number: "MCI-RJ-1122",
    qualification: "MD",
    facility_id: FACILITY_ID,
    department_id: null,
    is_active: true,
    ...stamp("2026-07-02T06:00:00Z"),
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1",
    keycloak_sub: "kc-nurse-1",
    username: "nurse.anita",
    full_name: "Anita Verma",
    email: "anita.verma@healthdoc.local",
    mobile: "+919876543212",
    designation: "Staff Nurse",
    employee_id: "EMP-014",
    registration_number: null,
    qualification: "BSc Nursing",
    facility_id: FACILITY_ID,
    department_id: null,
    is_active: true,
    ...stamp("2026-07-05T06:00:00Z"),
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2",
    keycloak_sub: "kc-rec-1",
    username: "reception.one",
    full_name: "Ravi Kumar",
    email: null,
    mobile: "+919876543213",
    designation: "Receptionist",
    employee_id: "EMP-021",
    registration_number: null,
    qualification: null,
    facility_id: FACILITY_ID,
    department_id: null,
    is_active: false,
    ...stamp("2026-07-08T06:00:00Z"),
  },
];

let accountRequests: UserAccountRequest[] = [
  {
    id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc1",
    facility_id: FACILITY_ID,
    requested_for_full_name: "Suresh Patel",
    requested_username: "lab.suresh",
    requested_roles: ["lab_tech"],
    designation: "Lab Technician",
    employee_id: "EMP-033",
    registration_number: null,
    qualification: "DMLT",
    email: "suresh.patel@healthdoc.local",
    mobile: "+919876543214",
    justification: "New pathology shift coverage for evening roster.",
    requested_by: MOCK_SESSION_ADMIN_USER_ID,
    status: "pending",
    decided_by: null,
    decided_at: null,
    rejection_reason: null,
    created_user_id: null,
    ...stamp("2026-07-18T10:00:00Z"),
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc2",
    facility_id: FACILITY_ID,
    requested_for_full_name: "Priya Nair",
    requested_username: "pharm.priya",
    requested_roles: ["pharmacist"],
    designation: "Pharmacist",
    employee_id: "EMP-041",
    registration_number: null,
    qualification: "BPharm",
    email: "priya.nair@healthdoc.local",
    mobile: "+919876543215",
    justification: "Pharmacy counter backfill.",
    requested_by: MOCK_APPROVER_USER_ID,
    status: "pending",
    decided_by: null,
    decided_at: null,
    rejection_reason: null,
    created_user_id: null,
    ...stamp("2026-07-19T09:00:00Z"),
  },
];

function seedModules(facilityId: string): FacilityModule[] {
  return MODULE_CODES.map((module_code, i) => ({
    id: `dddddddd-dddd-4ddd-8ddd-${String(i + 1).padStart(12, "0")}`,
    facility_id: facilityId,
    module_code,
    is_enabled: module_code !== "blood_bank",
    config: {},
    disabled_reason:
      module_code === "blood_bank" ? "Blood bank not rolled out yet" : null,
    ...stamp(),
  }));
}

let facilityModules: FacilityModule[] = seedModules(FACILITY_ID);

export function getFacilities(): Facility[] {
  return structuredClone(facilities);
}

export function getUsers(): User[] {
  return structuredClone(users);
}

export function setUsers(next: User[]) {
  users = next;
}

export function getAccountRequests(): UserAccountRequest[] {
  return structuredClone(accountRequests);
}

export function setAccountRequests(next: UserAccountRequest[]) {
  accountRequests = next;
}

export function getFacilityModules(): FacilityModule[] {
  return structuredClone(facilityModules);
}

export function setFacilityModules(next: FacilityModule[]) {
  facilityModules = next;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;
}

export function isoNow(): string {
  return new Date().toISOString();
}
