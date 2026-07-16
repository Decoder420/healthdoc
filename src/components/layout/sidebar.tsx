"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationForRole } from "@/config/navigation";
import { useUserRole } from "@/providers/auth-provider";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const role = useUserRole();
  const navItems = getNavigationForRole(role);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
      <div className="border-b border-border px-4 py-5">
        <p className="brand-gradient text-xl font-bold tracking-tight">
          healthdoc
        </p>
        <p className="text-xs text-muted-foreground">Hospital Management</p>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
