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
  | "user"
  | "FileText"
  | "Package"
  | "ClipboardList"
  | "tag"
  | "shoppingCart"
  | "clipboardCheck"
  | "receipt"
  | "arrowLeftRight"
  | "history"
  | "bell"
  | "triangleAlert"
  | "shieldCheck"
  | "archive"
  | "barcode"
  | "settings2"

  ;

export type NavItem = {
  label: string;
  href: string;
  roles?: Role[];
  icon?: NavIcon;
  children?: NavItem[];
};

const inventoryDepartments: NavItem[] = [
  {
    label: "Department Stock",
    href: "/inventory/departments/DepartmentStock",
    icon: "building",
  },

 {
    label: "Indent Requests",
    href: "/inventory/departments/IndentRequests",
    icon: "FileText",
  },
  ];

const inventoryPurchaseOrders: NavItem[] = [
  
   {
    label: "Purchase Requisition",
    href: "/inventory/purchase/PurchaseRequisition",
    icon: "FileText",
  },
  
  {
    label: "Purchase Orders",
    href: "/inventory/purchase/PurchaseOrders",
    icon: "Package",
  },

 {

    label: "GRN",
    href: "/inventory/purchase/grn",
    icon: "ClipboardList",

  },
  ];

  const inventoryWarehouse: NavItem[] = [
  {
    label: "Central Store",
    href: "/inventory/warehouse/central-store",
    icon: "warehouse",
  },
  {
    label: "Stock Transfer",
    href: "/inventory/warehouse/transfer",
    icon: "arrowLeftRight",
  },
  {
    label: "Stock Adjustment",
    href: "/inventory/warehouse/adjustment",
    icon: "settings2",
  },
  {
    label: "Returns",
    href: "/inventory/warehouse/returns",
    icon: "receipt",
  },
  {
    label: "Write-offs",
    href: "/inventory/warehouse/write-offs",
    icon: "archive",
  },
];

const inventoryAudit: NavItem[] = [
  {
    label: "Physical Verification",
    href: "/inventory/audit/verification",
    icon: "clipboardCheck",
  },
  {
    label: "Stock Ledger",
    href: "/inventory/audit/stock-ledger",
    icon: "history",
  },
  {
    label: "Transaction History",
    href: "/inventory/audit/transactions",
    icon: "history",
  },
];


  const inventoryProducts: NavItem[] = [

 {
    label: "Item Master",
    href: "/inventory/products/item-master",
    icon: "package",
  },

  {
    label: "Stock List",
    href: "/inventory/products/stock-list",
    icon: "boxes",
    
  },

 {
  
    label: "Categories",
    href: "/inventory/products/categories",
    icon: "Package",

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
    label: "Prescription Queue",
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
     children: inventoryProducts,

  },
  {
    label: "Suppliers",
    href: "/inventory/suppliers",
    icon: "truck",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  },

{
    label: "  Purchase",
    href: "/inventory/purchase",
    icon: "clipboard",
    roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
    children: inventoryPurchaseOrders,
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
  label: "Audit",
  href: "/inventory/audit",
  icon: "shieldCheck",
  roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  children: inventoryAudit,
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
