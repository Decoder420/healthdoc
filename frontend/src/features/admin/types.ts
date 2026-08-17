/** Admin DTOs — schema 0002 users, 0005 department_id, 0027 facility_modules, 0028 user_account_requests. */

export type ApprovalStatus = "pending" | "approved" | "rejected";

/** v3.13 — exactly five toggleable modules (facility_modules). */
export type ModuleCode = "lab" | "radiology" | "pharmacy" | "ot" | "blood_bank";

/** Keycloak realm roles from schema § access control + hod + superadmin (13 total). */
export type RealmRole =
  | "receptionist"
  | "doctor"
  | "nurse"
  | "lab_tech"
  | "radiology_tech"
  | "pharmacist"
  | "emergency"
  | "supervisor"
  | "admin"
  | "hod"
  | "auditor"
  | "patient"
  | "superadmin";

export type Facility = {
  id: string;
  code: string;
  name: string;
  state_code: string;
  district: string | null;
  facility_type: string | null;
  hfr_facility_id: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  keycloak_sub: string;
  username: string;
  full_name: string;
  email: string | null;
  mobile: string | null;
  designation: string | null;
  employee_id: string | null;
  registration_number: string | null;
  qualification: string | null;
  facility_id: string;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserCreateInput = {
  username: string;
  full_name: string;
  email?: string | null;
  mobile?: string | null;
  designation?: string | null;
  employee_id?: string | null;
  registration_number?: string | null;
  qualification?: string | null;
  facility_id: string;
  department_id?: string | null;
  roles: RealmRole[];
  temporary_password: string;
};

export type UserUpdateInput = {
  full_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  designation?: string | null;
  employee_id?: string | null;
  registration_number?: string | null;
  qualification?: string | null;
  department_id?: string | null;
};

export type UserListFilters = {
  query?: string;
  facility_id?: string | null;
  is_active?: boolean | null;
  page?: number;
  page_size?: number;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
};

export type UserAccountRequest = {
  id: string;
  facility_id: string;
  requested_for_full_name: string;
  requested_username: string;
  requested_roles: RealmRole[];
  designation: string | null;
  employee_id: string | null;
  registration_number: string | null;
  qualification: string | null;
  email: string | null;
  mobile: string | null;
  justification: string;
  requested_by: string;
  status: ApprovalStatus;
  decided_by: string | null;
  decided_at: string | null;
  rejection_reason: string | null;
  created_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAccountRequestInput = {
  facility_id: string;
  requested_for_full_name: string;
  requested_username: string;
  requested_roles: RealmRole[];
  designation?: string | null;
  employee_id?: string | null;
  registration_number?: string | null;
  qualification?: string | null;
  email?: string | null;
  mobile?: string | null;
  justification: string;
};

export type FacilityModule = {
  id: string;
  facility_id: string;
  module_code: ModuleCode;
  is_enabled: boolean;
  config: Record<string, unknown>;
  disabled_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type UpdateFacilityModuleInput = {
  is_enabled: boolean;
  disabled_reason?: string | null;
  config?: Record<string, unknown>;
};

/** GET /facility/capabilities mock shape (§4.4). */
export type FacilityCapabilities = {
  modules: Record<ModuleCode, boolean>;
  config: Record<ModuleCode, Record<string, unknown>>;
};
