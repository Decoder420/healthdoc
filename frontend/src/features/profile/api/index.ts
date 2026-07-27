import { ROLES, canonicalRole, type Role } from "@/config/roles";
import type { AuthUser } from "@/lib/auth";
import type {
  ChangePasswordInput,
  StaffProfile,
  StaffProfileUpdateInput,
} from "@/features/profile/types";

const PROFILE_STORAGE_KEY = "hms-staff-profiles";
export const DEMO_STAFF_PASSWORD = "staff123";

type ProfileSeed = Omit<StaffProfile, "id" | "role"> & {
  id: string;
  role: Role;
};

const sharedPreferences: StaffProfile["preferences"] = {
  emailNotifications: true,
  smsNotifications: false,
  language: "en",
};

/** Role-aware demo profiles aligned with login / dashboard roles. */
const PROFILE_SEEDS: Record<string, ProfileSeed> = {
  "dev-1": {
    id: "dev-1",
    employeeId: "EMP-REC-1001",
    name: "Priya Nair",
    email: "priya.nair@hospital.com",
    phone: "+91 98765 11122",
    alternatePhone: "+91 98765 33344",
    gender: "female",
    role: ROLES.RECEPTIONIST,
    department: "Front Desk",
    designation: "Receptionist",
    shift: "08:00 – 16:00",
    joiningDate: "2024-06-15",
    address: "42 Lake View Road, Pune",
    emergencyContactName: "Anil Nair",
    emergencyContactPhone: "+91 99887 76655",
    photo: "",
    preferences: { ...sharedPreferences },
  },
  "dev-doctor": {
    id: "dev-doctor",
    employeeId: "EMP-DOC-2001",
    name: "Dr. Mehta",
    email: "doctor.mehta@hospital.com",
    phone: "+91 98765 22001",
    alternatePhone: "+91 98765 22002",
    gender: "male",
    role: ROLES.DOCTOR,
    department: "General Medicine",
    designation: "Consultant Physician",
    shift: "09:00 – 17:00",
    joiningDate: "2021-03-10",
    address: "18 Clinic Avenue, Pune",
    emergencyContactName: "Mrs. Mehta",
    emergencyContactPhone: "+91 99887 22001",
    photo: "",
    preferences: { ...sharedPreferences, smsNotifications: true },
  },
  "dev-nurse": {
    id: "dev-nurse",
    employeeId: "EMP-NUR-3001",
    name: "Anita Desai",
    email: "anita.desai@hospital.com",
    phone: "+91 98765 33001",
    alternatePhone: "+91 98765 33002",
    gender: "female",
    role: ROLES.NURSE,
    department: "Inpatient Wards",
    designation: "Staff Nurse",
    shift: "07:00 – 15:00",
    joiningDate: "2022-08-01",
    address: "7 Palm Grove, Pune",
    emergencyContactName: "Suresh Desai",
    emergencyContactPhone: "+91 99887 33001",
    photo: "",
    preferences: { ...sharedPreferences },
  },
  "dev-lab": {
    id: "dev-lab",
    employeeId: "EMP-LAB-4001",
    name: "Dr. Sharma",
    email: "lab.sharma@hospital.com",
    phone: "+91 98765 44001",
    alternatePhone: "+91 98765 44002",
    gender: "male",
    role: ROLES.LAB_TECHNICIAN,
    department: "Pathology Lab",
    designation: "Lab Technician",
    shift: "08:00 – 16:00",
    joiningDate: "2023-01-20",
    address: "55 Science Park, Pune",
    emergencyContactName: "Kavita Sharma",
    emergencyContactPhone: "+91 99887 44001",
    photo: "",
    preferences: { ...sharedPreferences },
  },
  "dev-pharmacy": {
    id: "dev-pharmacy",
    employeeId: "EMP-PHR-5001",
    name: "Rahul Joshi",
    email: "rahul.joshi@hospital.com",
    phone: "+91 98765 55001",
    alternatePhone: "+91 98765 55002",
    gender: "male",
    role: ROLES.PHARMACIST,
    department: "Pharmacy",
    designation: "Pharmacist",
    shift: "09:00 – 18:00",
    joiningDate: "2022-11-05",
    address: "12 Market Road, Pune",
    emergencyContactName: "Neha Joshi",
    emergencyContactPhone: "+91 99887 55001",
    photo: "",
    preferences: { ...sharedPreferences },
  },
  "dev-admin": {
    id: "dev-admin",
    employeeId: "EMP-ADM-6001",
    name: "System Admin",
    email: "admin@hospital.com",
    phone: "+91 98765 66001",
    alternatePhone: "+91 98765 66002",
    gender: "other",
    role: ROLES.ADMIN,
    department: "Administration",
    designation: "System Administrator",
    shift: "09:00 – 18:00",
    joiningDate: "2020-01-01",
    address: "1 Hospital Campus, Pune",
    emergencyContactName: "IT Helpdesk",
    emergencyContactPhone: "+91 99887 66001",
    photo: "",
    preferences: { ...sharedPreferences, emailNotifications: true },
  },
};

const ROLE_FALLBACKS: Partial<
  Record<
    Role,
    Pick<StaffProfile, "department" | "designation" | "employeeId" | "shift">
  >
> = {
  [ROLES.RECEPTIONIST]: {
    department: "Front Desk",
    designation: "Receptionist",
    employeeId: "EMP-REC-0000",
    shift: "08:00 – 16:00",
  },
  [ROLES.DOCTOR]: {
    department: "Clinical Services",
    designation: "Doctor",
    employeeId: "EMP-DOC-0000",
    shift: "09:00 – 17:00",
  },
  [ROLES.NURSE]: {
    department: "Nursing",
    designation: "Nurse",
    employeeId: "EMP-NUR-0000",
    shift: "07:00 – 15:00",
  },
  [ROLES.LAB_TECHNICIAN]: {
    department: "Pathology Lab",
    designation: "Lab Technician",
    employeeId: "EMP-LAB-0000",
    shift: "08:00 – 16:00",
  },
  [ROLES.LAB]: {
    department: "Pathology Lab",
    designation: "Lab Technician",
    employeeId: "EMP-LAB-0000",
    shift: "08:00 – 16:00",
  },
  [ROLES.PHARMACIST]: {
    department: "Pharmacy",
    designation: "Pharmacist",
    employeeId: "EMP-PHR-0000",
    shift: "09:00 – 18:00",
  },
  [ROLES.PHARMACY]: {
    department: "Pharmacy",
    designation: "Pharmacist",
    employeeId: "EMP-PHR-0000",
    shift: "09:00 – 18:00",
  },
  [ROLES.ADMIN]: {
    department: "Administration",
    designation: "Administrator",
    employeeId: "EMP-ADM-0000",
    shift: "09:00 – 18:00",
  },
  [ROLES.ACCOUNTANT]: {
    department: "Accounts",
    designation: "Accountant",
    employeeId: "EMP-ACC-0000",
    shift: "09:00 – 18:00",
  },
};

function buildSeedProfiles(): Record<string, StaffProfile> {
  return Object.fromEntries(
    Object.values(PROFILE_SEEDS).map((seed) => [seed.id, { ...seed }]),
  );
}

function getRoleDefaults(role: Role) {
  const canonical = canonicalRole(role) ?? role;
  return (
    ROLE_FALLBACKS[canonical] ??
    ROLE_FALLBACKS[role] ?? {
      department: "General",
      designation: "Staff",
      employeeId: "EMP-STAFF-0000",
      shift: "09:00 – 18:00",
    }
  );
}

function createProfileForUser(user: AuthUser): StaffProfile {
  const seed = PROFILE_SEEDS[user.id];
  if (seed) {
    return {
      ...seed,
      id: user.id,
      name: user.name || seed.name,
      email: user.email || seed.email,
      role: user.role,
    };
  }

  const defaults = getRoleDefaults(user.role);
  return {
    id: user.id,
    employeeId: defaults.employeeId,
    name: user.name,
    email: user.email,
    phone: "",
    alternatePhone: "",
    gender: "other",
    role: user.role,
    department: defaults.department,
    designation: defaults.designation,
    shift: defaults.shift,
    joiningDate: new Date().toISOString().slice(0, 10),
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    photo: "",
    preferences: { ...sharedPreferences },
  };
}

function looksLikeStaleReceptionistTemplate(
  profile: StaffProfile,
  role: Role,
): boolean {
  const canonical = canonicalRole(role) ?? role;
  if (canonical === ROLES.RECEPTIONIST) return false;

  return (
    profile.role === ROLES.RECEPTIONIST ||
    profile.department === "Front Desk" ||
    profile.designation === "Receptionist" ||
    profile.employeeId.startsWith("EMP-REC-")
  );
}

function applyRoleToProfile(profile: StaffProfile, user: AuthUser): StaffProfile {
  const seed = PROFILE_SEEDS[user.id];
  const defaults = getRoleDefaults(user.role);
  const roleChanged = profile.role !== user.role;
  const staleTemplate = looksLikeStaleReceptionistTemplate(profile, user.role);

  if (!roleChanged && !staleTemplate) {
    return {
      ...profile,
      id: user.id,
      name: profile.name || user.name,
      email: profile.email || user.email,
      role: user.role,
    };
  }

  return {
    ...profile,
    id: user.id,
    name: user.name || seed?.name || profile.name,
    email: user.email || seed?.email || profile.email,
    role: user.role,
    employeeId: seed?.employeeId || defaults.employeeId,
    department: seed?.department || defaults.department,
    designation: seed?.designation || defaults.designation,
    shift: seed?.shift || defaults.shift,
    phone: profile.phone || seed?.phone || "",
    alternatePhone: profile.alternatePhone || seed?.alternatePhone || "",
    gender: profile.gender || seed?.gender || "other",
    joiningDate: profile.joiningDate || seed?.joiningDate || new Date().toISOString().slice(0, 10),
    address: profile.address || seed?.address || "",
    emergencyContactName:
      profile.emergencyContactName || seed?.emergencyContactName || "",
    emergencyContactPhone:
      profile.emergencyContactPhone || seed?.emergencyContactPhone || "",
    photo: profile.photo,
    preferences: profile.preferences ?? { ...sharedPreferences },
  };
}

function readProfiles(): Record<string, StaffProfile> {
  const seeds = buildSeedProfiles();

  if (typeof window === "undefined") {
    return seeds;
  }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(seeds));
      return seeds;
    }

    const stored = JSON.parse(raw) as Record<string, StaffProfile>;
    // Ensure known role seeds exist without wiping user edits for those ids.
    for (const [id, seed] of Object.entries(seeds)) {
      if (!stored[id]) stored[id] = seed;
    }
    return stored;
  } catch {
    return seeds;
  }
}

function writeProfiles(profiles: Record<string, StaffProfile>) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
  }
}

export function getStaffProfile(userId: string): StaffProfile {
  const profiles = readProfiles();
  if (profiles[userId]) return profiles[userId];

  const seed = PROFILE_SEEDS[userId];
  const created: StaffProfile = seed
    ? { ...seed }
    : {
        ...createProfileForUser({
          id: userId,
          name: "Staff",
          email: `${userId}@hospital.com`,
          role: ROLES.RECEPTIONIST,
        }),
      };

  profiles[userId] = created;
  writeProfiles(profiles);
  return created;
}

export function getStaffProfileForAuthUser(user: AuthUser): StaffProfile {
  const profiles = readProfiles();
  const existing = profiles[user.id];
  const next = existing
    ? applyRoleToProfile(existing, user)
    : createProfileForUser(user);

  profiles[user.id] = next;
  writeProfiles(profiles);
  return next;
}

export function updateStaffProfile(
  userId: string,
  input: Partial<StaffProfileUpdateInput>,
  options?: { role?: Role },
): { success: true; profile: StaffProfile } | { success: false; error: string } {
  const profiles = readProfiles();
  const current = profiles[userId] ?? getStaffProfile(userId);

  if (!input.name?.trim()) {
    return { success: false, error: "Full name is required." };
  }
  if (!input.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return { success: false, error: "Enter a valid email address." };
  }
  if (!input.phone?.trim()) {
    return { success: false, error: "Mobile number is required." };
  }

  const updated: StaffProfile = {
    ...current,
    ...input,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    alternatePhone: input.alternatePhone?.trim() ?? "",
    address: input.address?.trim() ?? "",
    emergencyContactName: input.emergencyContactName?.trim() ?? "",
    emergencyContactPhone: input.emergencyContactPhone?.trim() ?? "",
    department: input.department?.trim() || current.department,
    designation: input.designation?.trim() || current.designation,
    shift: input.shift?.trim() || current.shift,
    preferences: input.preferences ?? current.preferences,
    id: current.id,
    employeeId: current.employeeId,
    role: options?.role ?? current.role,
  };

  profiles[userId] = updated;
  writeProfiles(profiles);
  return { success: true, profile: updated };
}

export function changeStaffPassword(
  input: ChangePasswordInput,
): { success: true } | { success: false; error: string } {
  if (!input.currentPassword.trim()) {
    return { success: false, error: "Current password is required." };
  }
  if (input.currentPassword !== DEMO_STAFF_PASSWORD) {
    return {
      success: false,
      error: `Current password is incorrect. (Demo: ${DEMO_STAFF_PASSWORD})`,
    };
  }
  if (input.newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters." };
  }
  if (input.newPassword !== input.confirmPassword) {
    return { success: false, error: "New password and confirm password do not match." };
  }
  if (input.newPassword === input.currentPassword) {
    return { success: false, error: "New password must be different from current password." };
  }
  return { success: true };
}
