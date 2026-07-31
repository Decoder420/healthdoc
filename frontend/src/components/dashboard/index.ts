import type { ComponentType } from "react";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";
import { AccountantDashboard } from "./accountant";
import { AdminDashboard } from "./admin";
import { DoctorDashboard } from "./doctor";
import { LabTechnicianDashboard } from "./lab-technician";
import { NurseDashboard } from "./nurse";
import { PharmacyDashboardScreen } from "@/features/pharmacy/PharmacyDashboardScreen";
import { ReceptionistDashboard } from "./receptionist";

type DashboardComponent = ComponentType<{ userName?: string }>;

export const dashboardByRole: Partial<Record<Role, DashboardComponent>> = {
  [ROLES.ADMIN]: AdminDashboard,
  [ROLES.DOCTOR]: DoctorDashboard,
  [ROLES.NURSE]: NurseDashboard,
  [ROLES.RECEPTIONIST]: ReceptionistDashboard,
  [ROLES.PHARMACIST]: PharmacyDashboardScreen,
  [ROLES.LAB_TECHNICIAN]: LabTechnicianDashboard,
  [ROLES.ACCOUNTANT]: AccountantDashboard,
};
