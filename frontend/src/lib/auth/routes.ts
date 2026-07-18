import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

const DEFAULT_ROUTES: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin/users",
  [ROLES.DOCTOR]: "/doctor/dashboard",
  [ROLES.NURSE]: "/nurse/ward-dashboard",
  [ROLES.RECEPTIONIST]: "/dashboard",
  [ROLES.PHARMACIST]: "/pharmacy/prescription-queue",
  [ROLES.LAB_TECHNICIAN]: "/lab",
  [ROLES.ACCOUNTANT]: "/reports",
  [ROLES.INVENTORY_MANAGER]: "/inventory",
};

export function getDefaultRouteForRole(role: Role): string {
  return DEFAULT_ROUTES[role] ?? "/dashboard";
}
