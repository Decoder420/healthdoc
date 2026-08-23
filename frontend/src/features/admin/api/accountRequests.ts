/**
 * Maker-checker for staff account creation. Retired from fixtures (P1.1).
 *
 * The backend for this did not exist until it was built alongside this change:
 * migration 0028 created `user_account_requests`, the ORM model was there, and
 * nothing imported it — no router, no service, so the table was not even in
 * SQLAlchemy's metadata.
 *
 * WHAT CHANGED IN THE SHAPE OF THESE CALLS
 *
 * The fixture simulated maker-checker with two hardcoded ids —
 * MOCK_SESSION_ADMIN_USER_ID as requester, MOCK_APPROVER_USER_ID as approver —
 * so the "different person" rule was satisfied by two constants rather than by
 * anything real. Both are gone: requester and decider come from the token.
 *
 * `facility_id` is gone from the create payload for the same reason it left
 * UserCreateInput: the request is raised at the caller's own facility, derived
 * server-side.
 *
 * Approval now needs a temporary password, because approval genuinely creates
 * the Keycloak account. The fixture did not need one; it created nothing.
 */
import { api } from "@/lib/api";
import type {
  ApprovalStatus,
  CreateAccountRequestInput,
  UserAccountRequest,
} from "../types";

interface AccountRequestListResponse {
  items: UserAccountRequest[];
  page: number;
  page_size: number;
}

/**
 * GET /users/account-requests — requests at the caller's facility.
 *
 * No `facility_id` filter: the token carries it, and an optional scope filter
 * is one forgotten argument away from being no scope at all.
 */
export async function listAccountRequests(filters: {
  status?: ApprovalStatus | "all";
  page?: number;
  page_size?: number;
} = {}): Promise<AccountRequestListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("page_size", String(Math.min(filters.page_size ?? 20, 100)));
  if (filters.status && filters.status !== "all") params.set("status", filters.status);

  return api<AccountRequestListResponse>(`/users/account-requests?${params.toString()}`);
}

/** GET /users/account-requests/{id}. 404 for another facility's request. */
export async function getAccountRequest(id: string): Promise<UserAccountRequest> {
  return api<UserAccountRequest>(`/users/account-requests/${id}`);
}

/**
 * POST /users/account-requests — raise a request.
 *
 * Creates nothing in Keycloak. That is the point of the workflow: the account
 * does not exist until somebody else approves it.
 *
 * `requested_by` is no longer a parameter. It was defaulted to a mock constant,
 * which meant the requester recorded on every request was the same fictional
 * person — and the requester is exactly what the self-approval check compares.
 */
export async function createAccountRequest(
  payload: CreateAccountRequestInput,
): Promise<UserAccountRequest> {
  return api<UserAccountRequest>("/users/account-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /users/account-requests/{id}/approve — approves AND creates the account.
 *
 * Returns 409 `self_approval` if the approver raised the request. That is the
 * control: this call mints a working Keycloak credential, so an admin approving
 * their own request would have maker-checker in name only.
 *
 * Also 409 `not_pending` on a second decision, and `username_taken` if someone
 * created that username directly while the request was queued.
 */
export async function approveAccountRequest(
  id: string,
  temporary_password: string,
): Promise<UserAccountRequest> {
  return api<UserAccountRequest>(`/users/account-requests/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ temporary_password }),
  });
}

/**
 * POST /users/account-requests/{id}/reject — reject with a recorded reason.
 *
 * The reason is required by the server: a refusal with no reason is not
 * reviewable afterwards. Self-rejection is refused on the same grounds as
 * self-approval — withdrawing your own request and having it decided against
 * you are different events in an audit trail.
 */
export async function rejectAccountRequest(
  id: string,
  reason: string,
): Promise<UserAccountRequest> {
  return api<UserAccountRequest>(`/users/account-requests/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
