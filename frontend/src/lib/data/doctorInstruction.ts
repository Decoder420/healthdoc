import { DoctorInstruction } from "../../features/nurse/components/DoctorInstructions/DoctorInstructions.types";

export const DOCTOR_INSTRUCTIONS: DoctorInstruction[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    doctorName: "Dr. Raj Mehta",
    orderedAt: "16 Jul 2026 • 09:00 AM",
    instruction: "Continue IV Ceftriaxone 1 g IV twice daily.",
    status: "Pending",
  },
  {
    id: "2",
    patientUhid: "UHID-240012",
    doctorName: "Dr. Raj Mehta",
    orderedAt: "16 Jul 2026 • 09:15 AM",
    instruction: "Monitor blood pressure every 4 hours.",
    status: "Completed",
  },
  {
    id: "3",
    patientUhid: "UHID-240018",
    doctorName: "Dr. Neha Gupta",
    orderedAt: "16 Jul 2026 • 10:00 AM",
    instruction: "Repeat CBC tomorrow morning.",
    status: "Pending",
  },
];