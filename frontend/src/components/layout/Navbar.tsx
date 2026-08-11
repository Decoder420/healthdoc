"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { getNavigationForRole } from "@/config/navigation";
import { getStaffProfileForAuthUser } from "@/features/profile/api";
import { useAuth } from "@/providers/auth-provider";

import { ThemeToggle } from "./ThemeToggle";
import SearchPatients from "./SearchPatients";

function getPageTitle(
  pathname: string,
  role: ReturnType<typeof useAuth>["user"]
) {
  const navItems = getNavigationForRole(
    role?.role ?? null
  );

  const match = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" &&
        pathname.startsWith(item.href))
  );

  return match?.label ?? "Dashboard";
}

function formatRole(role?: string) {
  if (!role) return "Staff";

  return role
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

type NavbarProps = {
  onMenuClick?: () => void;
};

export function Navbar({
  onMenuClick,
}: NavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = getPageTitle(
    pathname,
    user
  );

  const [photo, setPhoto] = useState("");
  const [searchValue, setSearchValue] =
    useState("");

  /*
   * ==========================================
   * DETERMINE CURRENT MODULE
   * ==========================================
   *
   * /lab/*
   *       -> lab
   *
   * /radiology/*
   *       -> radiology
   *
   * Anything else
   *       -> null
   */
  const moduleType:
    | "lab"
    | "radiology"
    | null =
    pathname.startsWith("/radiology")
      ? "radiology"
      : pathname.startsWith("/lab")
        ? "lab"
        : null;

  /*
   * Clear search when changing module.
   *
   * Example:
   *
   * /lab/queue
   *      ↓
   * /radiology/queue
   *
   * Search input becomes empty.
   */
  useEffect(() => {
    setSearchValue("");
  }, [moduleType]);

  /*
   * Load staff profile photo.
   */
  useEffect(() => {
    if (!user) {
      setPhoto("");
      return;
    }

    const profile =
      getStaffProfileForAuthUser(user);

    setPhoto(profile.photo);
  }, [user, pathname]);

  return (
  <header className="flex h-16 w-full items-center border-b border-border bg-background px-4">
    {/* =====================================
        LEFT - PAGE TITLE
        ===================================== */}

    <div className="flex min-w-0 flex-1 items-center">
      <h1 className="text-lg font-semibold text-foreground">
        {pageTitle}
      </h1>
    </div>

    {/* =====================================
        CENTER - PATIENT SEARCH
        ===================================== */}

    <div className="flex flex-1 justify-center px-4">
      {moduleType && (
        <div className="relative w-full max-w-md">
          <SearchRoundedIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            fontSize="small"
          />

          <input
            type="text"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(event.target.value)
            }
            placeholder={
              moduleType === "radiology"
                ? "Search radiology patient, UHID, accession..."
                : "Search lab patient, UHID, order..."
            }
            className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <SearchPatients
            search={searchValue}
            module={moduleType}
            onPatientSelect={() =>
              setSearchValue("")
            }
          />
        </div>
      )}
    </div>

    {/* =====================================
        RIGHT - THEME + PROFILE
        ===================================== */}

    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
      <ThemeToggle />

      <Link
        href="/profile"
        className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
      >
        <div className="hidden flex-col text-right sm:flex">
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
