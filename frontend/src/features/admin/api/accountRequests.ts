import { MOCK_APPROVER_USER_ID, MOCK_SESSION_ADMIN_USER_ID } from "../constants";
import type {
  ApprovalStatus,
  CreateAccountRequestInput,
  Paginated,
  User,
  UserAccountRequest,
} from "../types";
import {
  getAccountRequests,
  getUsers,
  isoNow,
  newId,
  setAccountRequests,
  setUsers,
} from "@/lib/mock/admin_data";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
}

export class AdminApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AdminApiError";
    this.code = code;
  }
}

export async function listAccountRequests(filters: {
  status?: ApprovalStatus | "all";
  facility_id?: string;
  page?: number;
  page_size?: number;
} = {}): Promise<Paginated<UserAccountRequest>> {
  const page = filters.page ?? 1;
  const page_size = Math.min(filters.page_size ?? 20, 100);
  let rows = getAccountRequests();
  if (filters.facility_id) {
    rows = rows.filter((r) => r.facility_id === filters.facility_id);
  }
  if (filters.status && filters.status !== "all") {
    rows = rows.filter((r) => r.status === filters.status);
  }
  rows = rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const total = rows.length;
  const start = (page - 1) * page_size;
  return delay({
    items: rows.slice(start, start + page_size),
    page,
    page_size,
    total,
  });
}

export async function getAccountRequest(id: string): Promise<UserAccountRequest | null> {
  return delay(getAccountRequests().find((r) => r.id === id) ?? null);
}

export async function createAccountRequest(
  payload: CreateAccountRequestInput,
  requested_by: string = MOCK_SESSION_ADMIN_USER_ID,
): Promise<UserAccountRequest> {
  const t = isoNow();
  const row: UserAccountRequest = {
    id: newId(),
    facility_id: payload.facility_id,
    requested_for_full_name: payload.requested_for_full_name,
    requested_username: payload.requested_username,
    requested_roles: payload.requested_roles,
    designation: payload.designation ?? null,
    employee_id: payload.employee_id ?? null,
    registration_number: payload.registration_number ?? null,
    qualification: payload.qualification ?? null,
    email: payload.email ?? null,
    mobile: payload.mobile ?? null,
    justification: payload.justification,
    requested_by,
    status: "pending",
    decided_by: null,
    decided_at: null,
    rejection_reason: null,
    created_user_id: null,
    created_at: t,
    updated_at: t,
  };
  setAccountRequests([row, ...getAccountRequests()]);
  return delay(row);
}

/** Approve creates a User and returns it (§4.4). Request row is updated in mock store. */
export async function approveAccountRequest(
  id: string,
  decided_by: string = MOCK_APPROVER_USER_ID,
): Promise<User> {
  const store = getAccountRequests();
  const idx = store.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Account request not found");
  const row = store[idx];
  if (row.status !== "pending") throw new Error("Request is not pending");
  if (row.requested_by === decided_by) {
    throw new AdminApiError(
      "Self-approval is not allowed (requested_by ≠ decided_by)",
      "self_approval_not_allowed",
    );
  }

  const t = isoNow();
  const created: User = {
    id: newId(),
    keycloak_sub: `kc-${row.requested_username}`,
    username: row.requested_username,
    full_name: row.requested_for_full_name,
    email: row.email,
    mobile: row.mobile,
    designation: row.designation,
    employee_id: row.employee_id,
    registration_number: row.registration_number,
    qualification: row.qualification,
    facility_id: row.facility_id,
    department_id: null,
    is_active: true,
    created_at: t,
    updated_at: t,
  };
  setUsers([created, ...getUsers()]);

  const next: UserAccountRequest = {
    ...row,
    status: "approved",
    decided_by,
    decided_at: t,
    rejection_reason: null,
    created_user_id: created.id,
    updated_at: t,
  };
  store[idx] = next;
  setAccountRequests(store);
  return delay(created);
}

export async function rejectAccountRequest(
  id: string,
  rejection_reason: string,
  decided_by: string = MOCK_APPROVER_USER_ID,
): Promise<UserAccountRequest> {
  const store = getAccountRequests();
  const idx = store.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Account request not found");
  const row = store[idx];
  if (row.status !== "pending") throw new Error("Request is not pending");
  if (row.requested_by === decided_by) {
    throw new AdminApiError(
      "Self-approval is not allowed (requested_by ≠ decided_by)",
      "self_approval_not_allowed",
    );
  }
  if (!rejection_reason.trim()) throw new Error("rejection_reason is required");

  const t = isoNow();
  const next: UserAccountRequest = {
    ...row,
    status: "rejected",
    decided_by,
    decided_at: t,
    rejection_reason: rejection_reason.trim(),
    updated_at: t,
  };
  store[idx] = next;
  setAccountRequests(store);
  return delay(next);
}
