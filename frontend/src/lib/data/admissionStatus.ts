import { AdmissionStatusRecord } from "../../features/nurse/components/AdmissionStatus/AdmissionStatus.types";

export const ADMISSION_STATUS: AdmissionStatusRecord[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    status: "Admitted",
    updatedAt: "12 Jul 2026 • 10:00 AM",
    updatedBy: "Admission Desk",
    remarks: "Patient admitted to ICU.",
  },
  {
    id: "2",
    patientUhid: "UHID-240012",
    status: "Ward Transfer Pending",
    updatedAt: "17 Jul 2026 • 09:00 AM",
    updatedBy: "Dr. Raj Mehta",
    remarks: "Transfer to General Ward after observation.",
  },
  {
    id: "3",
    patientUhid: "UHID-240018",
    status: "Discharge Planned",
    updatedAt: "16 Jul 2026 • 02:00 PM",
    updatedBy: "Dr. Neha Gupta",
    remarks: "Patient likely to discharge tomorrow.",
  },
];