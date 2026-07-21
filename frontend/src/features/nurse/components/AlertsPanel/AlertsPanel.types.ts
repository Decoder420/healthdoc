export type AlertSeverity =
  | "Critical"
  | "Warning"
  | "Info";

export interface Alert {
  id: string;
  patientName: string;
  bedNumber: string;
  message: string;
  severity: AlertSeverity;
}