/**
 * The Keycloak realm's role names, verbatim.
 *
 * These strings are not ours to choose. They are the `name` values in
 * infra/keycloak/realm-healthdoc.json, they are what arrives in
 * `realm_access.roles` on the access token, and they are what the backend's
 * `require_roles(...)` compares against. Anything that does not match exactly
 * fails silently: the UI decides the user is someone else, and the API returns
 * 403 for reasons the screen cannot explain.
 *
 * The imported version of this file used `lab_technician` and `accountant`.
 * The realm has `lab_tech` and no accountant at all, so every lab technician
 * fell through the mapping (see keycloak.ts) and was handed a receptionist's
 * workspace.
 */
import type { RealmRole } from "@/features/admin/types";

export const ROLES = {
  RECEPTIONIST: "receptionist",
  DOCTOR: "doctor",
  NURSE: "nurse",
  LAB_TECH: "lab_tech",
  RADIOLOGY_TECH: "radiology_tech",
  PHARMACIST: "pharmacist",
  EMERGENCY: "emergency",
  SUPERVISOR: "supervisor",
  ADMIN: "admin",
  HOD: "hod",
  AUDITOR: "auditor",
  PATIENT: "patient",
  SUPERADMIN: "superadmin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Drift guard. `RealmRole` (features/admin/types.ts) is the list the admin
 * user-management screens already validate against. If either list gains or
 * loses a role without the other following, this stops compiling rather than
 * shipping two disagreeing ideas of who can log in.
 */
type Expect<T extends true> = T;
// Never referenced at runtime — the assertion IS the check. Disabled rather
// than removed: deleting it to silence the lint would delete the guard.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _RolesMatchRealm = Expect<
  [Role] extends [RealmRole] ? ([RealmRole] extends [Role] ? true : false) : false
>;
