export const ROLES = {
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  DOCTOR: "doctor",
  NURSE: "nurse",
  PHARMACY: "pharmacy",
  PHARMACIST: "pharmacist",
  LAB: "lab",
  LAB_TECHNICIAN: "lab_technician",
  RADIOLOGY: "radiology",
  RADIOLOGIST: "radiologist",
  ACCOUNTANT: "accountant",
  PATIENT: "patient",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES = Object.values(ROLES);

/** Normalize role aliases used across modules. */
export function canonicalRole(role: Role | null | undefined): Role | null {
  if (!role) return null;
  if (role === ROLES.LAB) return ROLES.LAB_TECHNICIAN;
  if (role === ROLES.PHARMACY) return ROLES.PHARMACIST;
  if (role === ROLES.RADIOLOGIST) return ROLES.RADIOLOGY;
  return role;
}
