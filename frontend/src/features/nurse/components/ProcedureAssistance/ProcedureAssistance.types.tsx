import { Patient } from "../PatientDetails/PatientDetails.types";

export type ProcedureStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface ProcedureRecord {
  id: string;
  patientUhid: string;
  procedureName: string;
  doctorName: string;
  scheduledAt: string;
  assistedBy: string;
  status: ProcedureStatus;
  remarks: string;
}

export interface ProcedureAssistanceProps {
  patient: Patient | null;
  procedures: ProcedureRecord[];
}