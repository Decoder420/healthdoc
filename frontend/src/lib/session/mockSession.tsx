"use client";

/**
 * Mock acting-role until F1 Keycloak session exists.
 * Sidebar/home follow BE role gates — not “everything under admin”.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BedDouble,
  FileText,
  Hospital,
  Receipt,
  Settings,
  Shield,
} from "lucide-react";

import type { RealmRole } from "@/features/admin/types";
import { REALM_ROLE_LABELS } from "@/features/admin/constants";

const STORAGE_KEY = "healthdoc.mockRole";

/** Roles you can preview in the shell (F6 + nurse/IPD mock screens). */
export const DEMO_ROLES = [
  "receptionist",
  "supervisor",
  "auditor",
  "admin",
  "doctor",
  "nurse",
] as const;

export type DemoRole = (typeof DEMO_ROLES)[number];

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Workplace, not an admin nest */
  area: "front_desk" | "clinical" | "finance" | "audit" | "admin";
};

const ALL_NAV: NavItem[] = [
  { href: "/nurse/ward-dashboard", label: "Nurse", icon: BedDouble, area: "clinical" },
  { href: "/ipd", label: "IPD", icon: Hospital, area: "clinical" },
  { href: "/billing", label: "Billing", icon: Receipt, area: "front_desk" },
  { href: "/consent", label: "Consent", icon: FileText, area: "clinical" },
  { href: "/reports", label: "Reports (MIS)", icon: BarChart3, area: "finance" },
  { href: "/audit-viewer", label: "Audit trail", icon: Shield, area: "audit" },
  { href: "/admin", label: "Admin", icon: Settings, area: "admin" },
];

/** F6 routes follow BE require_roles; nurse/IPD are mock screens on this branch. */
const NAV_HREFS_BY_ROLE: Record<DemoRole, readonly string[]> = {
  receptionist: ["/billing", "/consent"],
  supervisor: ["/billing", "/reports"],
  auditor: ["/audit-viewer", "/reports"],
  admin: [
    "/admin",
    "/nurse/ward-dashboard",
    "/ipd",
    "/billing",
    "/consent",
    "/reports",
    "/audit-viewer",
  ],
  doctor: ["/consent"],
  nurse: ["/nurse/ward-dashboard", "/ipd"],
};

const HOME_BY_ROLE: Record<DemoRole, string> = {
  receptionist: "/billing",
  supervisor: "/billing",
  auditor: "/audit-viewer",
  admin: "/admin",
  doctor: "/consent",
  nurse: "/nurse/ward-dashboard",
};

const AREA_LABELS: Record<NavItem["area"], string> = {
  front_desk: "Front desk",
  clinical: "Clinical",
  finance: "Finance / MIS",
  audit: "Audit",
  admin: "Facility admin",
};

export function homeForRole(role: DemoRole): string {
  return HOME_BY_ROLE[role];
}

function isDemoRole(value: string | null): value is DemoRole {
  return DEMO_ROLES.includes(value as DemoRole);
}

function readStoredRole(): DemoRole {
  if (typeof window === "undefined") return "admin";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (isDemoRole(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "admin";
}

type MockSessionValue = {
  role: DemoRole;
  roleLabel: string;
  navItems: NavItem[];
  homeHref: string;
  setRole: (role: DemoRole) => void;
  areaLabel: (area: NavItem["area"]) => string;
};

const MockSessionContext = createContext<MockSessionValue | null>(null);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<DemoRole>("admin");

  useEffect(() => {
    setRoleState(readStoredRole());
  }, []);

  const setRole = useCallback((next: DemoRole) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<MockSessionValue>(() => {
    const allowed = new Set(NAV_HREFS_BY_ROLE[role]);
    return {
      role,
      roleLabel: REALM_ROLE_LABELS[role as RealmRole] ?? role,
      navItems: ALL_NAV.filter((item) => allowed.has(item.href)),
      homeHref: HOME_BY_ROLE[role],
      setRole,
      areaLabel: (area) => AREA_LABELS[area],
    };
  }, [role, setRole]);

  return (
    <MockSessionContext.Provider value={value}>{children}</MockSessionContext.Provider>
  );
}

export function useMockSession(): MockSessionValue {
  const ctx = useContext(MockSessionContext);
  if (!ctx) {
    throw new Error("useMockSession must be used inside MockSessionProvider");
  }
  return ctx;
}
