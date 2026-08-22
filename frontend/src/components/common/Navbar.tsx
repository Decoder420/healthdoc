"use client";

import { Menu, Bell, LogOut, User, Search } from "lucide-react";
import { meridian } from "@/styles/theme";
import { REALM_ROLE_LABELS } from "@/features/admin/constants";
import { useAuth } from "@/providers/auth-provider";

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const roleLabel = user?.role
    ? (REALM_ROLE_LABELS[user.role] ?? user.role)
    : "Unassigned";

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
              {user?.name || roleLabel}
            </p>
            <p className="text-xs" style={{ color: meridian.textSecondary }}>
              {roleLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg p-2 transition-colors hover:bg-slate-100"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
