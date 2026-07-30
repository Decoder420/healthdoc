

export type QueueStatus =
  | "Waiting"
  | "In Progress"
  | "In Review"
  | "On Hold"
  | "Clarification Pending"
  | "Dispensing"
  | "Partial"
  | "Completed";

export type QueuePriority =
  | "Normal"
  | "High"
  | "STAT";

export interface QueueItem {
  id: string;
  queueNumber: string;
  patientName: string;
  uhid: string;
  doctor: string;
  visitType: "OPD" | "IPD" | "Emergency";
  medicines: number;
  priority: QueuePriority;
  status: QueueStatus;
  createdAt: string;

  holdReason?: string;
  holdNotes?: string;

  clarificationReason?: string;
  clarificationMessage?: string;

  pharmacistNotes?: string;
}