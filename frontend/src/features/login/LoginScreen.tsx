"use client";

import { useRouter } from "next/navigation";
import { ROLES, type Role } from "@/config/roles";

const DEV_ROLES: { role: Role; label: string; href: string }[] = [
  { role: ROLES.LAB_TECHNICIAN, label: "Lab Employee", href: "/lab/dashboard" },
  { role: ROLES.DOCTOR, label: "Doctor", href: "/doctor/dashboard" },
  { role: ROLES.RECEPTIONIST, label: "Receptionist", href: "/dashboard" },
  { role: ROLES.NURSE, label: "Nurse", href: "/nurse/ward-dashboard" },
  { role: ROLES.PHARMACIST, label: "Pharmacy", href: "/pharmacy/prescription-queue" },
  { role: ROLES.ADMIN, label: "Admin", href: "/admin/users" },
];

export default function LoginScreen() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dev role picker — Keycloak auth lands in F1-W1-03.
        </p>
      </div>

      <div className="grid gap-2">
        {DEV_ROLES.map((item) => (
          <button
            key={item.role}
            type="button"
            className="btn btn-secondary w-full justify-start"
            onClick={() => router.push(item.href)}
          >
            Continue as {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
