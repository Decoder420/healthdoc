import { Patient } from "../PatientDetails/PatientDetails.types";

export type MovementType =
  | "Bed Change"
  | "Ward Transfer"
  | "ICU Transfer"
  | "OT Transfer"
  | "Discharge";

export interface PatientMovementRecord {
  id: string;
  patientUhid: string;
  movementType: MovementType;
  fromLocation: string;
  toLocation: string;
  movedAt: string;
  approvedBy: string;
  reason: string;
}

export interface PatientMovementProps {
  patient: Patient | null;
  records: PatientMovementRecord[];
}