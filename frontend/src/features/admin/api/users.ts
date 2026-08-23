/**
 * Staff account administration. Retired from fixtures (P1.1).
 *
 * Every route here is admin-only and scoped to the caller's own facility,
 * server-side. That scoping is not decoration: this module was cross-tenant in
 * five separate ways before P0.4, including a `facility_id` query parameter on
 * the list that returned every staff account in the deployment when omitted.
 * Nothing here sends a facility — the token carries it.
 */
import { api } from "@/lib/api";
import type {
  Paginated,
  User,
  UserCreateInput,
  UserListFilters,
  UserUpdateInput,
} from "../types";

/**
 * GET /users — staff at the caller's facility.
 *
 * `search` is a real server-side parameter matching username, full name or
 * employee id. The fixture filtered client-side, which over a paginated list
 * means searching only the page you happen to be on: an admin looking for
 * someone on page three is told they do not exist.
 *
 * `facility_id` in the filters type is ignored on purpose — see the module
 * note. It is left in the type only because callers still pass it; the server
 * would refuse it anyway.
 */
export async function listUsers(
  filters: UserListFilters = {},
): Promise<Paginated<User>> {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("page_size", String(Math.min(filters.page_size ?? 20, 100)));
  if (filters.query?.trim()) params.set("search", filters.query.trim());
  if (filters.is_active !== null && filters.is_active !== undefined) {
    params.set("is_active", String(filters.is_active));
  }

  // No `total`: GET /users does not return one, and adding it would cost a
  // second COUNT on every page load for a value nothing renders.
  return api<Paginated<User>>(`/users?${params.toString()}`);
}

/** GET /users/{id}. 404 for another facility's user — indistinguishable from
 *  a nonexistent id, so the endpoint cannot be used to enumerate staff. */
export async function getUser(id: string): Promise<User> {
  return api<User>(`/users/${id}`);
}

/**
 * POST /users — creates the Keycloak account and the profile row.
 *
 * The account is created at the authenticated admin's facility. Sending
 * `facility_id` is refused 403, which is why UserCreateInput no longer has the
 * field: the only caller used to fill it from a hardcoded mock constant.
 */
export async function createUser(payload: UserCreateInput): Promise<User> {
  return api<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PATCH /users/{id}. facility_id is not updateable here — moving a staff
 *  account between facilities is a transfer with its own approval. */
export async function updateUser(id: string, patch: UserUpdateInput): Promise<User> {
  return api<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/**
 * POST /users/{id}/deactivate — disables the Keycloak account too.
 *
 * Not a local flag flip: the profile row and the credential are separate
 * systems, and deactivating one without the other leaves a working login for a
 * disabled member of staff.
 */
export async function deactivateUser(id: string): Promise<{ id: string; is_active: false }> {
  return api<{ id: string; is_active: false }>(`/users/${id}/deactivate`, {
    method: "POST",
  });
}

/** POST /users/{id}/activate — re-enables Keycloak and the profile row. */
export async function activateUser(id: string): Promise<{ id: string; is_active: true }> {
  return api<{ id: string; is_active: true }>(`/users/${id}/activate`, {
    method: "POST",
  });
}
