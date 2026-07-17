export const ROLES = {
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  DOCTOR: "doctor",
  NURSE: "nurse",
  PHARMACY: "pharmacy",
  LAB: "lab",
  PATIENT: "patient",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES = Object.values(ROLES);
