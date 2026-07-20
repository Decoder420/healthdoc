"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getNavigationForRole } from "@/config/navigation";
import { getStaffProfileForAuthUser } from "@/features/profile/api";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "./ThemeToggle";

function getPageTitle(
  pathname: string,
  role: ReturnType<typeof useAuth>["user"]
) {
  const navItems = getNavigationForRole(role?.role ?? null);

  const match = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  return match?.label ?? "Dashboard";
}

function formatRole(role?: string) {
  if (!role) return "Staff";

  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type NavbarProps = {
  onMenuClick?: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
};

export function Navbar({
  onMenuClick,
  search = "",
  onSearchChange,
}: NavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = getPageTitle(pathname, user);

  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (!user) {
      setPhoto("");
      return;
    }

    const profile = getStaffProfileForAuthUser(user);
    setPhoto(profile.photo);
  }, [user, pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card px-4 sm:px-6">
      {/* Left */}
     <div className="flex flex-1 h-full items-center">
  <span className="text-sm font-medium leading-none text-foreground">
    {pageTitle}
  </span>
</div>

      {/* Center */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <input
       type="text"
      value={search}
      onChange={(e) => onSearchChange?.(e.target.value)}
      placeholder="Search patient, UHID, doctor..."
      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
/>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-end gap-3">
        <ThemeToggle />

       <Link
  href="/profile"
  className="flex items-center justify-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
>
 <div className="hidden sm:flex flex-col justify-center gap-0.5 text-right">
  <p className="m-0 text-sm font-medium leading-none text-foreground">
    {user?.name ?? "Staff"}
  </p>

  <p className="m-0 text-xs leading-none text-muted-foreground">
    {formatRole(user?.role)}
  </p>
</div>

  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
    {photo ? (
      <img
        src={photo}
        alt={user?.name ?? "Profile"}
        className="h-full w-full object-cover"
      />
    ) : (
      user?.name?.charAt(0) ?? "S"
    )}
  </div>
</Link>
      </div>
    </header>
  );
}

export default Navbar;