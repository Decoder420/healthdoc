"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getNavigationForRole } from "@/config/navigation";
import { getStaffProfileForAuthUser } from "@/features/profile/api";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";

function getPageTitle(pathname: string, role: ReturnType<typeof useAuth>["user"]) {
  const navItems = getNavigationForRole(role?.role ?? null);

  for (const item of navItems) {
    const childMatch = item.children?.find(
      (child) =>
        pathname === child.href || pathname.startsWith(`${child.href}/`),
    );
    if (childMatch) return childMatch.label;

    if (
      pathname === item.href ||
      (item.href !== "/dashboard" &&
        item.href !== "/inventory" &&
        !item.children?.length &&
        pathname.startsWith(item.href))
    ) {
      return item.label;
    }
  }

  if (pathname === "/inventory" || pathname.startsWith("/inventory/")) {
    return "Inventory Overview";
  }

  return "Dashboard";
}

function formatRole(role?: string) {
  if (!role) return "Staff";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Navbar() {
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
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <p className="text-sm font-medium text-foreground">{pageTitle}</p>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
        >
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {user?.name ?? "Staff"}
            </p>
            <p className="text-xs text-muted-foreground">{formatRole(user?.role)}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={user?.name ?? "Profile"} className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0) ?? "S"
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
