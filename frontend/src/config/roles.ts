export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
  PHARMACIST: "pharmacist",
  LAB_TECHNICIAN: "lab_technician",
  ACCOUNTANT: "accountant",
  INVENTORY_MANAGER: "inventory_manager",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
