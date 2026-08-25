"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bed,
  Building2,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Package,
  Pill,
  Radio,
  Receipt,
  Search,
  Shield,
  Stethoscope,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { REALM_ROLE_LABELS } from "@/features/admin/constants";
import { canRoleAccessPath } from "@/lib/auth/routes";
import { useAuth } from "@/providers/auth-provider";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  area: "front_desk" | "clinical" | "diagnostics" | "finance" | "audit" | "admin";
};

const NAV_ITEMS: readonly NavItem[] = [
  // Head of department. Eight endpoints existed for this role with no route and
  // no nav entry, so an HOD logged in and had nowhere to go.
  { href: "/hod", label: "Department dashboard", icon: LayoutDashboard, area: "clinical" },
  { href: "/receptionist/registration", label: "Registration", icon: UserRound, area: "front_desk" },
  { href: "/receptionist/patient-search", label: "Patient search", icon: Search, area: "front_desk" },
  { href: "/receptionist/queue", label: "Queue", icon: Users, area: "front_desk" },
  { href: "/doctor/dashboard", label: "Doctor queue", icon: Stethoscope, area: "clinical" },
  { href: "/doctor/consultation", label: "Consultation", icon: ClipboardList, area: "clinical" },
  { href: "/doctor/orders", label: "Orders", icon: FlaskConical, area: "clinical" },
  { href: "/doctor/prescriptions", label: "Prescriptions", icon: Pill, area: "clinical" },
  { href: "/doctor/pharmacy-approvals", label: "Pharmacy approvals", icon: Pill, area: "clinical" },
  { href: "/nurse/ward-dashboard", label: "Ward dashboard", icon: Bed, area: "clinical" },
  { href: "/nurse/emar", label: "eMAR", icon: ClipboardList, area: "clinical" },
  { href: "/ipd", label: "IPD", icon: Building2, area: "clinical" },
  { href: "/emergency", label: "Emergency", icon: Stethoscope, area: "clinical" },
  { href: "/consent", label: "Consent", icon: FileText, area: "clinical" },
  { href: "/lab", label: "Laboratory", icon: FlaskConical, area: "diagnostics" },
  { href: "/radiology", label: "Radiology", icon: Radio, area: "diagnostics" },
  { href: "/pharmacy/prescription-queue", label: "Pharmacy queue", icon: Pill, area: "clinical" },
  { href: "/pharmacy/dispense", label: "Dispense", icon: Package, area: "clinical" },
  { href: "/inventory", label: "Inventory", icon: Package, area: "clinical" },
  { href: "/billing", label: "Billing", icon: Receipt, area: "finance" },
  { href: "/reports", label: "Reports", icon: BarChart3, area: "finance" },
  { href: "/audit-viewer", label: "Audit trail", icon: Shield, area: "audit" },
  { href: "/admin", label: "Administration", icon: LayoutDashboard, area: "admin" },
  { href: "/admin/departments", label: "Departments & rooms", icon: Building2, area: "admin" },
  { href: "/admin/abdm-sync", label: "ABDM identity links", icon: Shield, area: "admin" },
];

const AREA_LABELS: Record<NavItem["area"], string> = {
  front_desk: "Front desk",
  clinical: "Clinical",
  diagnostics: "Diagnostics",
  finance: "Finance / MIS",
  audit: "Audit",
  admin: "Facility admin",
};

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const { user } = useAuth();
  const roleLabel = user?.role
    ? (REALM_ROLE_LABELS[user.role] ?? user.role)
    : "Unassigned";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NAV_ITEMS.filter(
      (item) =>
        canRoleAccessPath(user?.role ?? null, item.href) &&
        item.label.toLowerCase().includes(q),
    );
  }, [query, user?.role]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const key = AREA_LABELS[item.area];
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="sidebar-overlay"
        />
      )}

      <aside
        id="workspace-sidebar"
        aria-label="Workspace navigation"
        aria-hidden={!open}
        inert={!open}
        className={`
    fixed
    top-[70px]
    left-0
    z-40
    h-[calc(100vh-70px)]
    w-[260px]
    bg-white
    border-r
    border-border
    shadow-lg
    overflow-y-auto
    transition-transform
    duration-300
    ease-in-out
    p-4

    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#001F54] tracking-wide">
              HMIS
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Signed in as {roleLabel}
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition"
            type="button"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mt-5 mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu..."
            className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-[#001F54] focus:bg-white transition"
          />
        </div>

        <nav aria-label="HealthDoc modules" className="space-y-4">
          {groups.length === 0 ? (
            <p className="px-2 text-sm text-gray-500">No screens for this role.</p>
          ) : (
            groups.map(([group, items]) => (
              <div key={group}>
                <p className="mb-2 text-[11px] uppercase tracking-[2px] text-gray-400 font-semibold">
                  {group}
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-xl px-4 py-3 transition ${
                          active ? "bg-[#EEF4FF]" : "hover:bg-[#EEF4FF]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 flex justify-center">
                            <Icon
                              size={20}
                              className={
                                active
                                  ? "text-[#001F54]"
                                  : "text-gray-500 group-hover:text-[#001F54]"
                              }
                            />
                          </div>
                          <span
                            className={`font-medium ${
                              active
                                ? "text-[#001F54]"
                                : "text-gray-700 group-hover:text-[#001F54]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-300 group-hover:text-[#001F54]"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </nav>
      </aside>
    </>
  );
}
