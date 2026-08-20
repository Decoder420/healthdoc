import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

/**
 * Where each role lands after signing in.
 *
 * Every route here must exist under src/app — the previous map sent
 * receptionists to "/dashboard", which is not a route in this application, so
 * a correct login ended on a 404.
 *
 * Typed as a total Record<Role, string>: adding a realm role without deciding
 * where that person starts is a compile error, not a silent redirect to
 * somebody else's workspace.
 */
const DEFAULT_ROUTES: Record<Role, string> = {
  [ROLES.RECEPTIONIST]: "/receptionist/registration",
  [ROLES.DOCTOR]: "/doctor/dashboard",
  [ROLES.NURSE]: "/nurse/ward-dashboard",
  [ROLES.LAB_TECH]: "/lab",
  [ROLES.RADIOLOGY_TECH]: "/radiology",
  [ROLES.PHARMACIST]: "/pharmacy/prescription-queue",
  [ROLES.EMERGENCY]: "/emergency",
  [ROLES.SUPERVISOR]: "/reports",
  [ROLES.ADMIN]: "/admin",
  [ROLES.HOD]: "/reports",
  [ROLES.AUDITOR]: "/audit-viewer",
  [ROLES.PATIENT]: "/patient-portal",
  [ROLES.SUPERADMIN]: "/admin",
};

/**
 * Client navigation guard. This is UX containment, not authorization: the API
 * still verifies the JWT and roles on every request. Keeping this map beside
 * the landing routes makes it impossible for the sidebar and guard to invent
 * different role policies.
 */
const ROUTE_PREFIXES: Record<Role, readonly string[]> = {
  [ROLES.RECEPTIONIST]: ["/receptionist", "/billing", "/consent"],
  [ROLES.DOCTOR]: ["/doctor", "/consent", "/ipd", "/lab", "/radiology"],
  [ROLES.NURSE]: ["/nurse", "/ipd", "/consent"],
  [ROLES.LAB_TECH]: ["/lab"],
  [ROLES.RADIOLOGY_TECH]: ["/radiology"],
  [ROLES.PHARMACIST]: ["/pharmacy", "/inventory"],
  [ROLES.EMERGENCY]: ["/emergency"],
  [ROLES.SUPERVISOR]: ["/consent", "/reports", "/emergency"],
  [ROLES.ADMIN]: ["/admin", "/billing", "/reports", "/audit-viewer"],
  [ROLES.HOD]: ["/reports", "/queue-display"],
  [ROLES.AUDITOR]: ["/audit-viewer", "/reports"],
  [ROLES.PATIENT]: ["/patient-portal"],
  [ROLES.SUPERADMIN]: ["/admin", "/reports"],
};

/**
 * `null` means the token carried no role we have a workspace for. Send them to
 * the root rather than into a workspace they cannot use — see
 * mapKeycloakRolesToAppRole for why guessing is worse than admitting it.
 */
export function getDefaultRouteForRole(role: Role | null): string {
  return role ? DEFAULT_ROUTES[role] : "/";
}

export function canRoleAccessPath(role: Role | null, pathname: string): boolean {
  if (!role) return false;
  if (pathname === "/") return true;
  return ROUTE_PREFIXES[role].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
