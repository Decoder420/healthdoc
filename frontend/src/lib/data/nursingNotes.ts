import { NursingNote } from "../../features/nurse/components/NursingNotes/NursingNotes.types";

export const NURSING_NOTES: NursingNote[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    recordedAt: "16 Jul 2026 • 08:30 AM",
    recordedBy: "Nurse Anita",
    note: "Patient is stable. Morning vitals recorded.",
  },
  {
    id: "2",
    patientUhid: "UHID-240012",
    recordedAt: "16 Jul 2026 • 12:15 PM",
    recordedBy: "Nurse Anita",
    note: "IV fluids administered as prescribed.",
  },
  {
    id: "3",
    patientUhid: "UHID-240018",
    recordedAt: "16 Jul 2026 • 04:20 PM",
    recordedBy: "Nurse Rahul",
    note: "Patient complained of mild chest discomfort. Doctor informed.",
  },
];