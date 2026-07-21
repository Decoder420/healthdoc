import { PatientMovementRecord } from "../../features/nurse/components/PatientMovement/PatientMovement.types";

export const PATIENT_MOVEMENTS: PatientMovementRecord[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    movementType: "Bed Change",
    fromLocation: "ICU • Bed B-101",
    toLocation: "ICU • Bed B-105",
    movedAt: "16 Jul 2026 • 09:30 AM",
    approvedBy: "Dr. Raj Mehta",
    reason: "Closer observation",
  },
  {
    id: "2",
    patientUhid: "UHID-240012",
    movementType: "Ward Transfer",
    fromLocation: "ICU",
    toLocation: "General Ward",
    movedAt: "17 Jul 2026 • 11:00 AM",
    approvedBy: "Dr. Raj Mehta",
    reason: "Patient condition improved",
  },
  {
    id: "3",
    patientUhid: "UHID-240018",
    movementType: "OT Transfer",
    fromLocation: "Ward",
    toLocation: "Operation Theatre",
    movedAt: "16 Jul 2026 • 01:15 PM",
    approvedBy: "Dr. Neha Gupta",
    reason: "Scheduled surgery",
  },
];