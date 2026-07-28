"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import QueueRoundedIcon from "@mui/icons-material/QueueRounded";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import ViewInArRoundedIcon from "@mui/icons-material/ViewInArRounded";
import WbIridescentRoundedIcon from "@mui/icons-material/WbIridescentRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";

import { getNavigationForRole } from "@/config/navigation";
import { useUserRole } from "@/providers/auth-provider";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const ICON_BY_HREF: Record<string, React.ReactNode> = {
  "/lab/dashboard": <DashboardRoundedIcon fontSize="small" />,
  "/lab/test_queue": <QueueRoundedIcon fontSize="small" />,
  "/lab/pathology/barcode": <QrCodeRoundedIcon fontSize="small" />,
  "/lab/pathology/sample": <ScienceRoundedIcon fontSize="small" />,
  "/lab/pathology/lab_results": <BiotechRoundedIcon fontSize="small" />,
  "/lab/pathology/verification": <VerifiedRoundedIcon fontSize="small" />,
  "/lab/pathology/settings": <SettingsRoundedIcon fontSize="small" />,
  "/dashboard": <HomeRoundedIcon fontSize="small" />,
  "/doctor/dashboard": <LocalHospitalRoundedIcon fontSize="small" />,

  // Radiology
  "/radiology/dashboard": <SpaceDashboardRoundedIcon fontSize="small" />,
  "/radiology/queue": <PendingActionsRoundedIcon fontSize="small" />,
  "/radiology/mri": <HubRoundedIcon fontSize="small" />,
  "/radiology/ct": <ViewInArRoundedIcon fontSize="small" />,
  "/radiology/xray": <WbIridescentRoundedIcon fontSize="small" />,
  "/radiology/mamography": <FavoriteRoundedIcon fontSize="small" />,
  "/radiology/usg": <GraphicEqRoundedIcon fontSize="small" />,
};

function isNavActive(pathname: string, href: string) {
  if (pathname === href) return true;

  if (href === "/radiology/dashboard") {
    return pathname === "/radiology" || pathname === "/radiology/dashboard";
  }

  if (href === "/lab/dashboard") {
    return pathname === "/lab" || pathname === "/lab/dashboard";
  }

  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname.startsWith(href);
}

export function Sidebar({ open: _open, onClose: _onClose }: SidebarProps = {}) {
  const pathname = usePathname();
  const role = useUserRole();
  const navItems = getNavigationForRole(role);

  let lastSection: string | undefined;

  return (
    <aside className="sticky top-0 flex min-h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="border-b border-border px-4 py-5">
        <p className="brand-gradient text-xl font-bold tracking-tight">
          HealthDoc
        </p>
        <p className="text-xs text-muted-foreground">Hospital Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const showSection =
            Boolean(item.section) && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          const isActive = isNavActive(pathname, item.href);

          return (
            <div key={`${item.href}-${item.label}`}>
              {showSection && (
                <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.section}
                </p>
              )}

              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary font-medium text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    isActive
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-muted text-primary",
                  )}
                >
                  {ICON_BY_HREF[item.href] ?? (
                    <DashboardRoundedIcon fontSize="small" />
                  )}
                </span>
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
