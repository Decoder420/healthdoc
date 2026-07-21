import { Patient } from "../PatientDetails/PatientDetails.types";

export type AdmissionStatusType =
  | "Admission Requested"
  | "Bed Pending"
  | "Admitted"
  | "Ward Transfer Pending"
  | "Transferred"
  | "Discharge Planned"
  | "Discharge Summary Pending"
  | "Billing Clearance Pending"
  | "Discharged"
  | "Referred"
  | "LAMA"
  | "Death";

export interface AdmissionStatusRecord {
  id: string;
  patientUhid: string;
  status: AdmissionStatusType;
  updatedAt: string;
  updatedBy: string;
  remarks: string;
}

export interface AdmissionStatusProps {
  patient: Patient | null;
  records: AdmissionStatusRecord[];
}