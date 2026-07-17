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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { getNavigationForRole } from "@/config/navigation";
import { useUserRole } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

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
};

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const role = useUserRole();
  const navItems = getNavigationForRole(role);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-card transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-5">
          <div>
            <p className="brand-gradient text-xl font-bold tracking-tight">
              HealthDoc
            </p>
            <p className="text-xs text-muted-foreground">Hospital Management</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <CloseRoundedIcon fontSize="small" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/lab/dashboard" &&
                pathname.startsWith(item.href)) ||
              (item.href === "/lab/dashboard" &&
                (pathname === "/lab" || pathname === "/lab/dashboard"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary font-medium text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="opacity-90">
                  {ICON_BY_HREF[item.href] ?? (
                    <DashboardRoundedIcon fontSize="small" />
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
