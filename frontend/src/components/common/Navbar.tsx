"use client";

import { useRouter } from "next/navigation";
import { Menu, Bell, User, Search } from "lucide-react";
import { meridian } from "@/styles/theme";
import { DEMO_ROLES, homeForRole, useMockSession } from "@/lib/session/mockSession";
import { REALM_ROLE_LABELS } from "@/features/admin/constants";

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setOpen }: NavbarProps) {
  const router = useRouter();
  const { role, roleLabel, setRole } = useMockSession();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b px-6"
      style={{
        backgroundColor: meridian.surface,
        borderColor: meridian.border,
        boxShadow: "0 1px 2px rgb(0 31 84 / 0.04)",
      }}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg p-2 transition-colors"
          style={{ color: meridian.textPrimary }}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ color: meridian.brandPrimary }}
        >
          HealthDoc HMIS
        </h1>
      </div>

      <div className="hidden w-[320px] lg:block">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: meridian.textSecondary }}
          />
          <input
            type="text"
            placeholder="Search…"
            className="w-full rounded-[10px] border py-2 pl-10 pr-4 text-sm outline-none"
            style={{
              borderColor: meridian.border,
              backgroundColor: meridian.muted,
              color: meridian.textPrimary,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4" style={{ color: meridian.textSecondary }}>
        <label className="hidden sm:flex items-center gap-2 text-xs">
          <span style={{ color: meridian.textSecondary }}>Role</span>
          <select
            value={role}
            onChange={(e) => {
              const next = e.target.value as (typeof DEMO_ROLES)[number];
              setRole(next);
              router.push(homeForRole(next));
            }}
            className="rounded-[10px] border px-2 py-1.5 text-sm font-medium outline-none"
            style={{
              borderColor: meridian.border,
              backgroundColor: meridian.muted,
              color: meridian.textPrimary,
            }}
            aria-label="Preview Keycloak role"
          >
            {DEMO_ROLES.map((r) => (
              <option key={r} value={r}>
                {REALM_ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>

        <Bell className="cursor-pointer" size={20} />

        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: meridian.brandPrimary }}
          >
            <User size={18} />
          </div>
          <div>
            <p className="font-medium" style={{ color: meridian.textPrimary }}>
              {roleLabel}
            </p>
            <p className="text-xs" style={{ color: meridian.textSecondary }}>
              Mock session
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
