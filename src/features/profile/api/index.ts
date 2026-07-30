import { ROLES } from "@/config/roles";
import type { AuthUser } from "@/lib/auth";
import type {
  ChangePasswordInput,
  StaffProfile,
  StaffProfileUpdateInput,
} from "@/features/profile/types";

const PROFILE_STORAGE_KEY = "hms-staff-profiles";

const defaultReceptionistProfile: StaffProfile = {
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
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    language: "en",
  },
};

function readProfiles(): Record<string, StaffProfile> {
  if (typeof window === "undefined") {
    return { [defaultReceptionistProfile.id]: defaultReceptionistProfile };
  }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      const seed = { [defaultReceptionistProfile.id]: defaultReceptionistProfile };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Record<string, StaffProfile>;
  } catch {
    return { [defaultReceptionistProfile.id]: defaultReceptionistProfile };
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

  const created: StaffProfile = {
    ...defaultReceptionistProfile,
    id: userId,
  };
  profiles[userId] = created;
  writeProfiles(profiles);
  return created;
}

export function getStaffProfileForAuthUser(user: AuthUser): StaffProfile {
  const existing = getStaffProfile(user.id);
  return {
    ...existing,
    id: user.id,
    name: existing.name || user.name,
    email: existing.email || user.email,
    role: user.role,
  };
}

export function updateStaffProfile(
  userId: string,
  input: Partial<StaffProfileUpdateInput>,
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
    role: current.role,
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
  if (input.currentPassword !== "receptionist123") {
    return { success: false, error: "Current password is incorrect. (Demo: receptionist123)" };
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
