"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Search, ChevronRight } from "lucide-react";

import { useMockSession } from "@/lib/session/mockSession";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const { roleLabel, navItems, areaLabel } = useMockSession();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [navItems, query]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      const key = areaLabel(item.area);
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered, areaLabel]);

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

        <nav className="space-y-4">
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
