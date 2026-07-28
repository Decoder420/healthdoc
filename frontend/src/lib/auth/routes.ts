import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

const DEFAULT_ROUTES: Record<Role, string> = {
  [ROLES.ADMIN]: "/admin/users",
  [ROLES.DOCTOR]: "/doctor/dashboard",
  [ROLES.NURSE]: "/nurse/ward-dashboard",
  [ROLES.RECEPTIONIST]: "/dashboard",
  [ROLES.PHARMACIST]: "/pharmacy/prescription-queue",
  [ROLES.PHARMACY]: "/pharmacy/prescription-queue",
  [ROLES.LAB_TECHNICIAN]: "/lab/dashboard",
  [ROLES.LAB]: "/lab/dashboard",
  [ROLES.RADIOLOGY]: "/radiology/dashboard",
  [ROLES.RADIOLOGIST]: "/radiology/dashboard",
  [ROLES.ACCOUNTANT]: "/reports",
  [ROLES.PATIENT]: "/patient-portal",
};

export function getDefaultRouteForRole(role: Role): string {
  return DEFAULT_ROUTES[role] ?? "/dashboard";
}
