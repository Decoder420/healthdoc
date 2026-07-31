import type { Role } from "@/config/roles";

export type StaffGender = "male" | "female" | "other";

export type StaffProfile = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  gender: StaffGender;
  role: Role;
  department: string;
  designation: string;
  shift: string;
  joiningDate: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  photo: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: "en" | "hi";
  };
};

export type StaffProfileUpdateInput = Omit<StaffProfile, "id" | "role" | "employeeId">;

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
