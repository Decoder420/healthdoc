import { ROLES, canonicalRole, type Role } from "./roles";

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
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Test Queue",
    href: "/lab/test_queue",
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Barcode",
    href: "/lab/pathology/barcode",
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Sample",
    href: "/lab/pathology/sample",
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Lab Results",
    href: "/lab/pathology/lab_results",
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Verification",
    href: "/lab/pathology/verification",
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Settings",
    href: "/lab/pathology/settings",
    roles: [ROLES.LAB, ROLES.LAB_TECHNICIAN],
  },
  {
    label: "Home",
    href: "/dashboard",
    roles: [
      ROLES.ADMIN,
      ROLES.RECEPTIONIST,
      ROLES.DOCTOR,
      ROLES.NURSE,
      ROLES.PHARMACIST,
      ROLES.PHARMACY,
      ROLES.ACCOUNTANT,
    ],
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
    roles: [ROLES.PHARMACY, ROLES.PHARMACIST, ROLES.ADMIN],
  },
  {
    label: "Admin",
    href: "/admin/users",
    roles: [ROLES.ADMIN],
  },
];

export function navItemsForRole(role: Role | null | undefined): NavItem[] {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

/** Alias used by shared sidebar layout. */
export function getNavigationForRole(role: Role | null | undefined): NavItem[] {
  return navItemsForRole(role);
}

export { canonicalRole };
