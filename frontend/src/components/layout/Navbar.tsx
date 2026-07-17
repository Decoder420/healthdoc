"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { getNavigationForRole } from "@/config/navigation";
import { getStaffProfileForAuthUser } from "@/features/profile/api";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
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
};

export function Navbar({ onMenuClick }: NavbarProps) {
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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MenuRoundedIcon fontSize="small" />
        </Button>
        <p className="text-sm font-medium text-foreground">{pageTitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">
              {user?.name ?? "Staff"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRole(user?.role)}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
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
