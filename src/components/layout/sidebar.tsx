"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRightLeft,
  Archive,
  BarChart3,
  BedDouble,
  Bell,
  Boxes,
  Building2,
  ChevronDown,
  ClipboardList,
  ClipboardCheck,
  FileText,
  Droplet,
  FlaskConical,
  History,
  LayoutDashboard,
  Network,
  Package,
  Pill,
  Receipt,
  ScanLine,
  Scissors,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Siren,
  Tags,
  TriangleAlert,
  Truck,
  UserRound,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import {
  getNavigationForRole,
  type NavIcon,
  type NavItem,
} from "@/config/navigation";
import { useUserRole } from "@/providers/auth-provider";
import { cn } from "@/lib/utils/cn";

const NAV_ICONS: Partial<Record<NavIcon, LucideIcon>> = {
  dashboard: LayoutDashboard,

  package: Package,
  Package: Package,

  building: Building2,

  scan: ScanLine,

  pill: Pill,

  droplet: Droplet,

  siren: Siren,

  boxes: Boxes,

  truck: Truck,

  clipboard: ClipboardList,

  ClipboardList: ClipboardList,

  FileText: FileText,

  chart: BarChart3,

  warehouse: Warehouse,

  bed: BedDouble,

  scissors: Scissors,

  swap: ArrowRightLeft,

  arrowLeftRight: ArrowRightLeft,

  network: Network,

  flask: FlaskConical,

  user: UserRound,

  tag: Tags,

  shoppingCart: ShoppingCart,

  clipboardCheck: ClipboardCheck,

  receipt: Receipt,

  history: History,

  bell: Bell,

  triangleAlert: TriangleAlert,

  shieldCheck: ShieldCheck,

  archive: Archive,

  settings2: Settings2,
};

function isItemActive(pathname: string, item: NavItem) {
  if (pathname === item.href) return true;
  if (item.href === "/dashboard" || item.href === "/inventory") {
    return pathname === item.href;
  }
  return pathname.startsWith(item.href);
}

function NavIconBadge({
  icon,
  active,
}: {
  icon?: NavIcon;
  active?: boolean;
}) {
  if (!icon) return null;
  const Icon = NAV_ICONS[icon];
  if (!Icon) return null;
  return (
    <Icon
      size={16}
      className={cn(
        "shrink-0",
        active ? "text-primary-foreground" : "text-muted-foreground",
      )}
    />
  );
}

function NavLink({
  item,
  pathname,
  nested = false,
}: {
  item: NavItem;
  pathname: string;
  nested?: boolean;
}) {
  const active = isItemActive(pathname, item);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
        nested && "pl-3",
        active
          ? "bg-primary font-medium text-primary-foreground"
          : "text-foreground hover:bg-muted",
      )}
    >
      <NavIconBadge icon={item.icon} active={active} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const childActive = item.children?.some((child) =>
    isItemActive(pathname, child),
  );
  const [open, setOpen] = useState(Boolean(childActive));

  useEffect(() => {
    if (childActive) {
      const frame = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [childActive]);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
          childActive
            ? "bg-muted font-medium text-foreground"
            : "text-foreground hover:bg-muted",
        )}
        aria-expanded={open}
      >
        <NavIconBadge icon={item.icon} />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && item.children ? (
        <div className="ml-3 space-y-1 border-l border-border pl-2">
          {item.children.map((child) => (
            <NavLink
              key={child.href}
              item={child}
              pathname={pathname}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

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
        {navItems.map((item) =>
          item.children?.length ? (
            <NavGroup key={item.href} item={item} pathname={pathname} />
          ) : (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ),
        )}
      </nav>
    </aside>
  );
}
