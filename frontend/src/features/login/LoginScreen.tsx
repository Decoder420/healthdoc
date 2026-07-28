"use client";

import { setAuthSession, type AuthUser } from "@/lib/auth";
import { ROLES, type Role } from "@/config/roles";

const DEV_ROLES: {
  role: Role;
  label: string;
  href: string;
  user: AuthUser;
}[] = [
  {
    role: ROLES.LAB_TECHNICIAN,
    label: "Lab Employee",
    href: "/lab/dashboard",
    user: {
      id: "dev-lab",
      name: "Dr. Sharma",
      email: "lab.sharma@hospital.com",
      role: ROLES.LAB_TECHNICIAN,
    },
  },
  {
    role: ROLES.DOCTOR,
    label: "Doctor",
    href: "/doctor/dashboard",
    user: {
      id: "dev-doctor",
      name: "Dr. Mehta",
      email: "doctor.mehta@hospital.com",
      role: ROLES.DOCTOR,
    },
  },
  {
    role: ROLES.RECEPTIONIST,
    label: "Receptionist",
    href: "/dashboard",
    user: {
      id: "dev-1",
      name: "Priya Nair",
      email: "priya.nair@hospital.com",
      role: ROLES.RECEPTIONIST,
    },
  },
  {
    role: ROLES.NURSE,
    label: "Nurse",
    href: "/nurse/ward-dashboard",
    user: {
      id: "dev-nurse",
      name: "Anita Desai",
      email: "anita.desai@hospital.com",
      role: ROLES.NURSE,
    },
  },
  {
    role: ROLES.PHARMACIST,
    label: "Pharmacy",
    href: "/pharmacy/prescription-queue",
    user: {
      id: "dev-pharmacy",
      name: "Rahul Joshi",
      email: "rahul.joshi@hospital.com",
      role: ROLES.PHARMACIST,
    },
  },
  {
    role: ROLES.RADIOLOGY,
    label: "Radiology",
    href: "/radiology/dashboard",
    user: {
      id: "dev-radiology",
      name: "Dr. Kapoor",
      email: "radiology.kapoor@hospital.com",
      role: ROLES.RADIOLOGY,
    },
  },
  {
    role: ROLES.ADMIN,
    label: "Admin",
    href: "/admin/users",
    user: {
      id: "dev-admin",
      name: "System Admin",
      email: "admin@hospital.com",
      role: ROLES.ADMIN,
    },
  },
];

export default function LoginScreen() {
  function handleContinue(item: (typeof DEV_ROLES)[number]) {
    sessionStorage.removeItem("hms-auth-logged-out");
    setAuthSession(item.user, "dev-token");
    window.location.href = item.href;
  }

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
            onClick={() => handleContinue(item)}
          >
            Continue as {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
