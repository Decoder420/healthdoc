"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ROLES, type Role } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/mui-field";
import { setAuthSession } from "@/lib/auth";
import { isDevAuthEnabled } from "@/lib/auth/mode";
import { loginWithKeycloak } from "@/lib/auth/keycloak";
import { getDefaultRouteForRole } from "@/lib/auth/routes";
import { useAuth } from "@/providers/auth-provider";

const DEV_USERS: Record<
  Role,
  { id: string; name: string; email: string; role: Role }
> = {
  [ROLES.RECEPTIONIST]: {
    id: "dev-1",
    name: "Priya Nair",
    email: "priya.nair@hospital.com",
    role: ROLES.RECEPTIONIST,
  },
  [ROLES.DOCTOR]: {
    id: "doc-002",
    name: "Dr. Singh",
    email: "singh@hospital.com",
    role: ROLES.DOCTOR,
  },
  [ROLES.NURSE]: {
    id: "nurse-001",
    name: "Anjali Rao",
    email: "anjali.rao@hospital.com",
    role: ROLES.NURSE,
  },
  [ROLES.ADMIN]: {
    id: "admin-1",
    name: "Admin User",
    email: "admin@hospital.com",
    role: ROLES.ADMIN,
  },
  [ROLES.PHARMACIST]: {
    id: "pharm-1",
    name: "Ravi Pharmacy",
    email: "pharmacy@hospital.com",
    role: ROLES.PHARMACIST,
  },
  [ROLES.LAB_TECHNICIAN]: {
    id: "lab-1",
    name: "Lab Tech",
    email: "lab@hospital.com",
    role: ROLES.LAB_TECHNICIAN,
  },
  [ROLES.ACCOUNTANT]: {
    id: "acc-1",
    name: "Accounts",
    email: "accounts@hospital.com",
    role: ROLES.ACCOUNTANT,
  },
};

export function LoginScreen() {
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();
  const [role, setRole] = useState<Role>(ROLES.RECEPTIONIST);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const devAuth = isDevAuthEnabled();

  function redirectAfterLogin(selectedRole: Role) {
    const redirectTo = searchParams.get("redirect");
    const destination =
      redirectTo &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//") &&
      redirectTo !== "/"
        ? redirectTo
        : getDefaultRouteForRole(selectedRole);
    window.location.href = destination;
  }

  async function handleKeycloakLogin() {
    setBusy(true);
    setError(null);
    try {
      const redirectTo = searchParams.get("redirect");
      const redirectUri =
        redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
          ? `${window.location.origin}${redirectTo}`
          : `${window.location.origin}/dashboard`;
      await loginWithKeycloak(redirectUri);
    } catch (err) {
      console.error(err);
      setError("Keycloak sign-in failed. Check KEYCLOAK is running and NEXT_PUBLIC_KEYCLOAK_URL.");
      setBusy(false);
    }
  }

  function handleDevLogin() {
    if (!devAuth) return;
    const user = DEV_USERS[role];
    // UX presence only — no bearer token; APIs stay unauthenticated in pure UI mode.
    setAuthSession(user);
    updateUser(user);
    redirectAfterLogin(role);
  }

  return (
    <div className="surface-card p-8">
      <p className="brand-gradient text-3xl font-bold tracking-tight">healthdoc</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Hospital Information Management System
      </p>

      <div className="mt-6 space-y-4">
        {!devAuth && (
          <>
            <Button
              type="button"
              onClick={() => void handleKeycloakLogin()}
              className="w-full"
              disabled={busy}
            >
              {busy ? "Redirecting…" : "Sign in with Keycloak"}
            </Button>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Identity is Keycloak OIDC. Middleware only gates navigation; API
              calls use a Bearer access token held in memory.
            </p>
          </>
        )}

        {devAuth && (
          <>
            <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Dev auth mode (`NEXT_PUBLIC_AUTH_MODE=dev`). UI scaffolding only —
              not production identity. Do not use against real patient data.
            </p>
            <FieldSelect
              label="Dev role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              options={[
                { value: ROLES.RECEPTIONIST, label: "Receptionist" },
                { value: ROLES.DOCTOR, label: "Doctor" },
                { value: ROLES.NURSE, label: "Nurse" },
                { value: ROLES.ADMIN, label: "Admin" },
                { value: ROLES.PHARMACIST, label: "Pharmacist" },
                { value: ROLES.LAB_TECHNICIAN, label: "Lab Technician" },
                { value: ROLES.ACCOUNTANT, label: "Accountant" },
              ]}
            />
            <Button type="button" onClick={handleDevLogin} className="w-full">
              Continue (dev UI only)
            </Button>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        No account?{" "}
        <Link href="/register" className="link-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
