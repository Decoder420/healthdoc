import { Patient } from "../PatientDetails/PatientDetails.types";

export type TimelineEventType =
  | "Vitals"
  | "Medication"
  | "Doctor Round"
  | "Nursing Note"
  | "Procedure"
  | "Transfer"
  | "Lab";

export interface TimelineEvent {
  id: string;
  patientUhid: string;
  type: TimelineEventType;
  title: string;
  description: string;
  recordedAt: string;
  recordedBy: string;
}

export interface PatientTimelineProps {
  patient: Patient | null;
  events: TimelineEvent[];
}