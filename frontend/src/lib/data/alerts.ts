import { Alert } from "../../features/nurse/components/AlertsPanel/AlertsPanel.types";

export const ALERTS: Alert[] = [
  {
    id: "1",
    patientName: "Rahul Kumar",
    bedNumber: "B-101",
    message: "Blood Pressure is critically high",
    severity: "Critical",
  },
  {
    id: "2",
    patientName: "Amit Singh",
    bedNumber: "B-103",
    message: "Medication overdue",
    severity: "Warning",
  },
  {
    id: "3",
    patientName: "Sneha Patel",
    bedNumber: "B-108",
    message: "Vitals updated successfully",
    severity: "Info",
  },
];