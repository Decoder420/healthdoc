import type { ComponentType } from "react";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";
import { AccountantDashboard } from "./accountant";
import { AdminDashboard } from "./admin";
import { DoctorDashboard } from "./doctor";
import { LabTechnicianDashboard } from "./lab-technician";
import { NurseDashboard } from "./nurse";
import { PharmacistDashboard } from "./pharmacist";
import { ReceptionistDashboard } from "./receptionist";
import RadiologyDashboardPage from "./radiology/Dashboard/dash";

type DashboardComponent = ComponentType<{ userName?: string }>;

export const dashboardByRole: Partial<Record<Role, DashboardComponent>> = {
  [ROLES.ADMIN]: AdminDashboard,
  [ROLES.DOCTOR]: DoctorDashboard,
  [ROLES.NURSE]: NurseDashboard,
  [ROLES.RECEPTIONIST]: ReceptionistDashboard,
  [ROLES.PHARMACIST]: PharmacistDashboard,
  [ROLES.PHARMACY]: PharmacistDashboard,
  [ROLES.LAB_TECHNICIAN]: LabTechnicianDashboard,
  [ROLES.LAB]: LabTechnicianDashboard,
  [ROLES.RADIOLOGY]: RadiologyDashboardPage as DashboardComponent,
  [ROLES.RADIOLOGIST]: RadiologyDashboardPage as DashboardComponent,
  [ROLES.ACCOUNTANT]: AccountantDashboard,
};

export { LabTechnicianDashboard };
