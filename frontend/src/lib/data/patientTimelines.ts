import { TimelineEvent } from "../../features/nurse/components/PatientTimeline/PatientTimeline.types";

export const PATIENT_TIMELINE: TimelineEvent[] = [
  {
    id: "1",
    patientUhid: "UHID-240012",
    type: "Vitals",
    title: "Vitals Recorded",
    description: "BP 120/80, Pulse 82, Temp 98.4°F",
    recordedAt: "16 Jul 2026 • 08:00 AM",
    recordedBy: "Nurse Anita",
  },

  {
    id: "2",
    patientUhid: "UHID-240012",
    type: "Medication",
    title: "Medication Administered",
    description: "IV Ceftriaxone 1g",
    recordedAt: "16 Jul 2026 • 09:00 AM",
    recordedBy: "Nurse Anita",
  },

  {
    id: "3",
    patientUhid: "UHID-240012",
    type: "Doctor Round",
    title: "Doctor Review",
    description: "Continue antibiotics for next 3 days",
    recordedAt: "16 Jul 2026 • 10:00 AM",
    recordedBy: "Dr. Raj Mehta",
  },

  {
    id: "4",
    patientUhid: "UHID-240018",
    type: "Procedure",
    title: "Chest X-Ray",
    description: "Procedure completed successfully",
    recordedAt: "16 Jul 2026 • 11:30 AM",
    recordedBy: "Radiology",
  },
];