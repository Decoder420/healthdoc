import { ProcedureRecord } from "../../features/nurse/components/ProcedureAssistance/ProcedureAssistance.types";

export const PROCEDURES: ProcedureRecord[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    procedureName: "ECG",
    doctorName: "Dr. Raj Mehta",
    scheduledAt: "16 Jul 2026 • 09:00 AM",
    assistedBy: "Nurse Anita",
    status: "Completed",
    remarks: "Procedure completed successfully.",
  },

  {
    id: "2",
    patientUhid: "UHID-240012",
    procedureName: "Chest X-Ray",
    doctorName: "Dr. Raj Mehta",
    scheduledAt: "16 Jul 2026 • 01:30 PM",
    assistedBy: "Nurse Rahul",
    status: "Scheduled",
    remarks: "Patient to be shifted to Radiology.",
  },

  {
    id: "3",
    patientUhid: "UHID-240018",
    procedureName: "Blood Sample Collection",
    doctorName: "Dr. Neha Gupta",
    scheduledAt: "16 Jul 2026 • 10:30 AM",
    assistedBy: "Nurse Priya",
    status: "Completed",
    remarks: "Sample sent to laboratory.",
  },
];