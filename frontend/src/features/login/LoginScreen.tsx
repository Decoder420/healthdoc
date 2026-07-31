"use client";

import Link from "next/link";
import { useState } from "react";
import { ROLES, type Role } from "@/config/roles";
import { Button } from "@/components/ui/button";
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

const ROLE_OPTIONS = [
  { value: ROLES.RECEPTIONIST, label: "Receptionist" },
  { value: ROLES.DOCTOR, label: "Doctor" },
  { value: ROLES.NURSE, label: "Nurse" },
  { value: ROLES.ADMIN, label: "Admin" },
  { value: ROLES.PHARMACIST, label: "Pharmacist" },
  { value: ROLES.LAB_TECHNICIAN, label: "Lab Technician" },
  { value: ROLES.ACCOUNTANT, label: "Accountant" },
  { value: ROLES.INVENTORY_MANAGER, label: "Inventory Manager" },
];

/** Inline fallbacks so login stays readable if remote CSS fails to load. */
const cardStyle: React.CSSProperties = {
  width: "100%",
  padding: "2rem",
  borderRadius: "0.75rem",
  border: "1px solid #d6dee8",
  background: "#ffffff",
  color: "#001f54",
  boxShadow: "0 1px 2px rgba(0, 31, 84, 0.06)",
};

const selectStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  minHeight: "2.75rem",
  marginTop: "0.375rem",
  padding: "0.625rem 0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #d6dee8",
  background: "#ffffff",
  color: "#001f54",
  fontSize: "0.875rem",
};

export function LoginScreen() {
  const [role, setRole] = useState<Role>(ROLES.RECEPTIONIST);

  function handleDevLogin() {
    const user = DEV_USERS[role];
    if (!user) return;
    setAuthSession(user, "dev-token");

    const redirectTo = new URLSearchParams(window.location.search).get(
      "redirect",
    );
    const destination =
      redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
        ? redirectTo
        : getDefaultRouteForRole(role);

    window.location.href = destination;
  }

  return (
    <div className="surface-card p-8" style={cardStyle}>
      <p
        className="brand-gradient text-3xl font-bold tracking-tight"
        style={{ color: "#001f54", fontSize: "1.875rem", fontWeight: 700 }}
      >
        healthdoc
      </p>
      <h1
        className="mt-4 text-2xl font-semibold text-foreground"
        style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: 600 }}
      >
        Sign in
      </h1>
      <p
        className="mt-2 text-sm text-muted-foreground"
        style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#4a6282" }}
      >
        Hospital Information Management System
      </p>

      <div className="mt-6 space-y-4" style={{ marginTop: "1.5rem" }}>
        <label className="block space-y-1.5" style={{ display: "block" }}>
          <span
            className="text-sm font-medium text-foreground"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            Dev role
          </span>
          <select
            className="file-input cursor-pointer appearance-auto"
            style={selectStyle}
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" onClick={handleDevLogin} className="w-full">
          Continue (dev login)
        </Button>
      </div>

      <p
        className="mt-4 text-xs text-muted-foreground"
        style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#4a6282" }}
      >
        No account?{" "}
        <Link href="/register" className="link-primary" style={{ color: "#001f54" }}>
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginScreen;
