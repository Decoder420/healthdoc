import { HandoverNote } from "../../features/nurse/components/HandoverNotes/HandoverNotes.types";

export const HANDOVER_NOTES: HandoverNote[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    fromShift: "Morning",
    toShift: "Evening",
    outgoingNurse: "Nurse Anita",
    incomingNurse: "Nurse Rahul",
    handedOverAt: "16 Jul 2026 • 03:00 PM",
    summary:
      "Patient stable. Continue IV Ceftriaxone. Monitor blood pressure every 4 hours.",
  },
  {
    id: "2",
    patientUhid: "UHID-240012",
    fromShift: "Evening",
    toShift: "Night",
    outgoingNurse: "Nurse Rahul",
    incomingNurse: "Nurse Priya",
    handedOverAt: "16 Jul 2026 • 11:00 PM",
    summary:
      "Evening medications administered. Intake/Output chart updated. Patient resting comfortably.",
  },
  {
    id: "3",
    patientUhid: "UHID-240012",
    fromShift: "Night",
    toShift: "Morning",
    outgoingNurse: "Nurse Priya",
    incomingNurse: "Nurse Anita",
    handedOverAt: "17 Jul 2026 • 07:00 AM",
    summary:
      "Night uneventful. Morning vitals pending. Continue antibiotics as prescribed.",
  },
  {
    id: "4",
    patientUhid: "UHID-240018",
    fromShift: "Morning",
    toShift: "Evening",
    outgoingNurse: "Nurse Kavita",
    incomingNurse: "Nurse Mohit",
    handedOverAt: "16 Jul 2026 • 03:00 PM",
    summary:
      "Patient shifted after blood sugar monitoring. Continue diabetic diet and glucose charting.",
  },
];