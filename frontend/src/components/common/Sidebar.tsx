"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Search,
  LayoutDashboard,
  Receipt,
  Shield,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NAV_ITEMS = [
  { href: "/billing", label: "Billing", icon: Receipt },
  { href: "/consent", label: "Consent", icon: FileText },
  { href: "/audit-viewer", label: "Audit viewer", icon: Shield },
  { href: "/reports", label: "Reports (MIS)", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Settings },
] as const;

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      {open && (
        <div onClick={() => setOpen(false)} className="sidebar-overlay" />
      )}

      <aside
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
            <p className="text-xs text-gray-500 mt-1">F6 · Admin &amp; finance</p>
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

        <p className="mb-3 text-[11px] uppercase tracking-[2px] text-gray-400 font-semibold">
          Menu
        </p>

        <nav className="space-y-2">
          <Link
            href="/billing"
            onClick={() => setOpen(false)}
            className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                <LayoutDashboard
                  size={20}
                  className="text-gray-500 group-hover:text-[#001F54]"
                />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
                Home (Billing)
              </span>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 group-hover:text-[#001F54]"
            />
          </Link>

          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center">
                    <Icon
                      size={20}
                      className="text-gray-500 group-hover:text-[#001F54]"
                    />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
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
        </nav>
      </aside>
    </>
  );
}
