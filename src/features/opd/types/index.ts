import type { Patient } from "@/features/patients/types";

export type Doctor = {
  id: string;
  name: string;
  departmentId: string;
  department: string;
  departmentCode: string;
};

export type Department = {
  id: string;
  name: string;
  code: string;
};

export type PaymentMethod = "cash" | "card" | "upi";

export type OpdVisit = {
  opdId: string;
  uhid: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  departmentCode: string;
  tokenNumber: string;
  tokenFee: number;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  createdAt: string;
};

export type QueueEntry = {
  id: string;
  tokenNumber: string;
  uhid: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  opdId: string;
  priority: "normal" | "urgent";
  status: "waiting" | "called" | "completed";
  addedAt: string;
};

export type OpdWorkflowStep =
  | "search"
  | "patient"
  | "doctor"
  | "fee"
  | "receipt"
  | "complete";

export type OpdWorkflowState = {
  step: OpdWorkflowStep;
  searchQuery: string;
  patient: Patient | null;
  isNewPatient: boolean;
  opdId: string;
  departmentId: string;
  doctorId: string;
  tokenNumber: string;
  tokenFee: number;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  visit: OpdVisit | null;
};

export const OPD_TOKEN_FEE = 100;

export const WORKFLOW_STEPS: { id: OpdWorkflowStep; label: string }[] = [
  { id: "search", label: "Search UHID" },
  { id: "patient", label: "Patient" },
  { id: "doctor", label: "Doctor" },
  { id: "fee", label: "Token Fee" },
  { id: "receipt", label: "Receipt" },
  { id: "complete", label: "Queue" },
];
