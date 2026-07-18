import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

export type NavIcon =
  | "dashboard"
  | "package"
  | "building"
  | "scan"
  | "pill"
  | "droplet"
  | "siren"
  | "boxes"
  | "truck"
  | "clipboard"
  | "chart"
  | "warehouse"
  | "bed"
  | "scissors"
  | "swap"
  | "network"
  | "flask"
  | "user";

export type NavItem = {
  label: string;
  href: string;
  roles?: Role[];
  icon?: NavIcon;
  children?: NavItem[];
};

const inventoryDepartments: NavItem[] = [
  {
    label: "Radiology",
    href: "/inventory/departments/radiology",
    icon: "scan",
  },
  {
    label: "Pharmacy",
    href: "/inventory/departments/pharmacy",
    icon: "pill",
  },
  {
    label: "Blood",
    href: "/inventory/departments/blood",
    icon: "droplet",
  },
  {
    label: "Emergency",
    href: "/inventory/departments/emergency",
    icon: "siren",
  },
  {
    label: "Hospital Ward Items",
    href: "/inventory/departments/hospital-ward-items",
    icon: "bed",
  },
  {
    label: "Operation Theatre",
    href: "/inventory/departments/operation-theatre",
    icon: "scissors",
  },
  {
    label: "Inventory Transactions",
    href: "/inventory/departments/transactions",
    icon: "swap",
  },
  {
    label: "Inventory Entity Model",
    href: "/inventory/departments/entity-model",
    icon: "network",
  },
  {
    label: "Laboratory Equipment Inventory",
    href: "/inventory/departments/laboratory-equipment",
    icon: "flask",
  },
];

export const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    roles: [
      ROLES.ADMIN,
      ROLES.DOCTOR,
      ROLES.NURSE,
      ROLES.RECEPTIONIST,
      ROLES.PHARMACIST,
      ROLES.LAB_TECHNICIAN,
      ROLES.ACCOUNTANT,
    ],
  },
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
    label: "Inventory Overview",
    href: "/inventory",
    icon: "package",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  },
  {
    label: "Departments",
    href: "/inventory/departments",
    icon: "building",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
    children: inventoryDepartments,
  },
  {
    label: "Products",
    href: "/inventory/products",
    icon: "boxes",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  },
  {
    label: "Suppliers",
    href: "/inventory/suppliers",
    icon: "truck",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  },
  {
    label: "Purchased Orders",
    href: "/inventory/purchase-orders",
    icon: "clipboard",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  },
  {
    label: "Reports",
    href: "/inventory/reports",
    icon: "chart",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  },
  {
    label: "Warehouse",
    href: "/inventory/warehouse",
    icon: "warehouse",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
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
  { label: "Profile", href: "/profile", icon: "user" },
];

function filterNavItem(item: NavItem, role: Role | null): NavItem | null {
  if (!role) {
    return item.roles ? null : item;
  }

  if (role === ROLES.ADMIN) {
    return item;
  }

  if (item.roles && !item.roles.includes(role)) {
    return null;
  }

  if (!item.children?.length) {
    return item;
  }

  return {
    ...item,
    children: item.children.filter(
      (child) => !child.roles || child.roles.includes(role),
    ),
  };
}

export function getNavigationForRole(role: Role | null): NavItem[] {
  return navigation
    .map((item) => filterNavItem(item, role))
    .filter((item): item is NavItem => Boolean(item));
}
