import { ROLES, type Role } from "./roles";

export type NavItem = {
  label: string;
  href: string;
  roles: Role[];
};

/** Sidebar / menu items filtered by role. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/lab/dashboard",
    roles: [ROLES.LAB],
  },
  {
    label: "Test Queue",
    href: "/lab/test_queue",
    roles: [ROLES.LAB],
  },
  {
    label: "Barcode",
    href: "/lab/pathology/barcode",
    roles: [ROLES.LAB],
  },
  {
    label: "Sample",
    href: "/lab/pathology/sample",
    roles: [ROLES.LAB],
  },
  {
    label: "Lab Results",
    href: "/lab/pathology/lab_results",
    roles: [ROLES.LAB],
  },
  {
    label: "Verification",
    href: "/lab/pathology/verification",
    roles: [ROLES.LAB],
  },
  {
    label: "Settings",
    href: "/lab/pathology/settings",
    roles: [ROLES.LAB],
  },
  {
    label: "Reception",
    href: "/receptionist/registration",
    roles: [ROLES.RECEPTIONIST, ROLES.ADMIN],
  },
  {
    label: "Doctor",
    href: "/doctor/dashboard",
    roles: [ROLES.DOCTOR, ROLES.ADMIN],
  },
  {
    label: "Nurse",
    href: "/nurse/ward-dashboard",
    roles: [ROLES.NURSE, ROLES.ADMIN],
  },
  {
    label: "Pharmacy",
    href: "/pharmacy/prescription-queue",
    roles: [ROLES.PHARMACY, ROLES.ADMIN],
  },
  {
    label: "Admin",
    href: "/admin/users",
    roles: [ROLES.ADMIN],
  },
];

export function navItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
