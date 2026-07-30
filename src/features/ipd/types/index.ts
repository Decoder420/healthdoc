export type IpdRequestType =
  | "admission"
  | "observation"
  | "procedure"
  | "transfer"
  | "nurse_care";

export type IpdRequestStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type IpdAdmissionRequest = {
  id: string;
  opdId: string;
  tokenNumber: string;
  uhid: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  type: IpdRequestType;
  priority: "normal" | "urgent";
  status: IpdRequestStatus;
  clinicalNotes: string;
  instructions: string;
  bedId: string;
  bedLabel: string;
  ward: string;
  nurseId: string;
  nurseName: string;
  assignedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type IpdBedStatus = "available" | "occupied" | "cleaning" | "blocked";

export type IpdBed = {
  id: string;
  label: string;
  ward: string;
  careType: "general" | "semi_private" | "private" | "icu" | "observation";
  status: IpdBedStatus;
  currentRequestId: string;
  currentPatientName: string;
};

export type IpdNurse = {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  ward: string;
  status: "available" | "busy" | "off_duty";
  activeAssignments: number;
};

export type AssignIpdResourcesInput = {
  bedId: string;
  nurseId: string;
  instructions?: string;
};

export type RaiseIpdRequestInput = {
  opdId?: string;
  tokenNumber?: string;
  uhid: string;
  patientName: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  type: IpdRequestType;
  priority: "normal" | "urgent";
  clinicalNotes: string;
};

export const IPD_REQUEST_TYPE_LABELS: Record<IpdRequestType, string> = {
  admission: "Ward Admission",
  observation: "Observation Stay",
  procedure: "IPD Procedure",
  transfer: "Ward Transfer",
  nurse_care: "Nurse Care",
};

export const IPD_REQUEST_STATUS_LABELS: Record<IpdRequestStatus, string> = {
  pending: "Pending Assignment",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
