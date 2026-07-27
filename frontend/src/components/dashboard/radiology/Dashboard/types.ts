import { ReactNode } from "react";

export type Priority = "Routine" | "Urgent" | "Emergency";

export type QueueStatus =
  | "Waiting"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type ReportStatus =
  | "Draft"
  | "Pending Verification"
  | "Verified"
  | "Released";

export type Modality =
  | "X-Ray"
  | "CT"
  | "MRI"
  | "Ultrasound"
  | "Mammography"
  | "ECG";

export interface KPICardData {
  id: number;
  title: string;
  value: number;
  subtitle?: string;
  trend?: number;
  icon: ReactNode;
}

export interface ImagingTrendData {
  day: string;
  xray: number;
  ct: number;
  mri: number;
  ultrasound: number;
}

export interface ModalityDistribution {
  id: number;
  label: Modality;
  value: number;
}

export interface MachineUtilization {
  machine: string;
  utilization: number;
}

export interface AppointmentQueue {
  id: number;
  token: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  modality: Modality;
  procedure: string;
  radiologist: string;
  appointmentTime: string;
  priority: Priority;
  status: QueueStatus;
}

export interface RecentReport {
  id: number;
  reportId: string;
  patientName: string;
  uhid: string;
  modality: Modality;
  procedure: string;
  radiologist: string;
  reportDate: string;
  status: ReportStatus;
}

export interface CriticalAlert {
  id: number;
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  createdAt: string;
}

export interface ModalityCard {
  id: number;
  modality: Modality;
  total: number;
  completed: number;
  pending: number;
  averageTime: string;
}

export interface WorkflowStep {
  id: number;
  label: string;
  completed: boolean;
}

export interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  color:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
}

export interface DashboardSummary {
  totalOrders: number;
  pendingReports: number;
  completedReports: number;
  verifiedReports: number;
  cancelledOrders: number;
  criticalCases: number;
}