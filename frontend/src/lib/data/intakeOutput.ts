import { IntakeOutputRecord } from "../../features/nurse/components/IntakeOutput/IntakeOutput.types";

export const INTAKE_OUTPUT: IntakeOutputRecord[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    recordedAt: "16 Jul 2026 • 08:00 AM",
    intake: 500,
    output: 250,
    balance: 250,
    recordedBy: "Nurse Anita",
  },
  {
    id: "2",
    patientUhid: "UHID-240012",
    recordedAt: "16 Jul 2026 • 02:00 PM",
    intake: 700,
    output: 500,
    balance: 200,
    recordedBy: "Nurse Anita",
  },
  {
    id: "3",
    patientUhid: "UHID-240018",
    recordedAt: "16 Jul 2026 • 10:30 AM",
    intake: 600,
    output: 450,
    balance: 150,
    recordedBy: "Nurse Rahul",
  },
];