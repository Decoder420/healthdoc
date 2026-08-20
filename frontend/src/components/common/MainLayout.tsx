"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canRoleAccessPath, getDefaultRouteForRole } from "@/lib/auth/routes";
import { useAuth } from "@/providers/auth-provider";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const isPublic = pathname === "/login";
  const allowed = pathname === "/" || canRoleAccessPath(user?.role ?? null, pathname);

  useEffect(() => {
    if (isLoading) return;
    if (isPublic) {
      if (isAuthenticated && user?.role) {
        router.replace(getDefaultRouteForRole(user.role));
      }
      return;
    }
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user?.role && !allowed) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [allowed, isAuthenticated, isLoading, isPublic, pathname, router, user?.role]);

  if (isPublic) return <>{children}</>;

  if (isLoading || !isAuthenticated || (user?.role && !allowed)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your workspace…
      </div>
    );
  }

  if (!user?.role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card max-w-lg p-8 text-center">
          <h1 className="text-xl font-semibold">No HealthDoc role assigned</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your Keycloak account is valid, but it has no supported workspace role.
            Ask an administrator to assign one.
          </p>
          <button className="mt-6 underline" type="button" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar setOpen={setOpen} />

      <Sidebar open={open} setOpen={setOpen} />

      <main className="pt-16 p-6">
        {children}
      </main>
    </div>
  );
}
