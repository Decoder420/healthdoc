"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ROLES, type Role } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/mui-field";
import { setAuthSession } from "@/lib/auth";
import { getDefaultRouteForRole } from "@/lib/auth/routes";

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
  [ROLES.INVENTORY_MANAGER]: {
    id: "inventory-1",
    name: "Inventory Manager",
    email: "inventory@hospital.com",
    role: ROLES.INVENTORY_MANAGER,
  },
};

export function LoginScreen() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>(ROLES.RECEPTIONIST);

  function handleDevLogin() {
    const user = DEV_USERS[role];
    setAuthSession(user, "dev-token");
    const redirectTo = searchParams.get("redirect");
    const destination =
      redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
        ? redirectTo
        : getDefaultRouteForRole(role);
    window.location.href = destination;
  }

  return (
    <div className="surface-card p-8">
      <p className="brand-gradient text-3xl font-bold tracking-tight">healthdoc</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Hospital Information Management System
      </p>

      <div className="mt-6 space-y-4">
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
            { value: ROLES.INVENTORY_MANAGER, label: "Inventory Manager" },
          ]}
        />
        <Button type="button" onClick={handleDevLogin} className="w-full">
          Continue (dev login)
        </Button>
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
