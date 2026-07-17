import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

export type NavItem = {
  label: string;
  href: string;
  roles?: Role[];
};

export const navigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Registration",
    href: "/receptionist/registration",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    label: "Queue",
    href: "/receptionist/queue",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    label: "Patient search",
    href: "/receptionist/patient-search",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.NURSE],
  },
  {
    label: "Doctor home",
    href: "/doctor/dashboard",
    roles: [ROLES.ADMIN, ROLES.DOCTOR],
  },
  {
    label: "Consultation",
    href: "/doctor/consultation",
    roles: [ROLES.ADMIN, ROLES.DOCTOR],
  },
  {
    label: "Orders",
    href: "/doctor/orders",
    roles: [ROLES.ADMIN, ROLES.DOCTOR],
  },
  {
    label: "Prescriptions",
    href: "/doctor/prescriptions",
    roles: [ROLES.ADMIN, ROLES.DOCTOR],
  },
  {
    label: "Ward dashboard",
    href: "/nurse/ward-dashboard",
    roles: [ROLES.ADMIN, ROLES.NURSE],
  },
  {
    label: "eMAR",
    href: "/nurse/emar",
    roles: [ROLES.ADMIN, ROLES.NURSE],
  },
  {
    label: "IPD",
    href: "/ipd",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.NURSE],
  },
  {
    label: "Pharmacy queue",
    href: "/pharmacy/prescription-queue",
    roles: [ROLES.ADMIN, ROLES.PHARMACIST],
  },
  {
    label: "Dispense",
    href: "/pharmacy/dispense",
    roles: [ROLES.ADMIN, ROLES.PHARMACIST],
  },
  {
    label: "Lab",
    href: "/lab",
    roles: [ROLES.ADMIN, ROLES.LAB_TECHNICIAN, ROLES.DOCTOR],
  },
  {
    label: "Radiology",
    href: "/radiology",
    roles: [ROLES.ADMIN, ROLES.LAB_TECHNICIAN, ROLES.DOCTOR],
  },
  {
    label: "Emergency",
    href: "/emergency",
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
  },
  {
    label: "Inventory",
    href: "/inventory",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Billing (UI gallery)",
    href: "/billing",
    roles: [ROLES.ADMIN, ROLES.ACCOUNTANT],
  },
  {
    label: "Reports",
    href: "/reports",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.ACCOUNTANT],
  },
  {
    label: "Consent",
    href: "/consent",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    label: "Audit viewer",
    href: "/audit-viewer",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Users",
    href: "/admin/users",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Departments",
    href: "/admin/departments",
    roles: [ROLES.ADMIN],
  },
  {
    label: "ABDM sync",
    href: "/admin/abdm-sync",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Doctors",
    href: "/doctors",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    label: "Appointments",
    href: "/appointments",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR],
  },
  { label: "Settings", href: "/settings", roles: [ROLES.ADMIN] },
  { label: "Profile", href: "/profile" },
];

export function getNavigationForRole(role: Role | null): NavItem[] {
  if (!role) return navigation.filter((item) => !item.roles);
  if (role === ROLES.ADMIN) return navigation;
  return navigation.filter(
    (item) => !item.roles || item.roles.includes(role),
  );
}
