import { Patient } from "@/app/nurse/components/PatientDetails/PatientDetails.types";

export const patients: Record<string, Patient> = {
  "1": {
    id: "P001",
    patientName: "Rahul Kumar",
    uhid: "UHID-240012",
    age: 52,
    gender: "Male",
    diagnosis: "Pneumonia",
    consultant: "Dr. Raj Mehta",
    ward: "ICU",
    bedNumber: "B-101",
    admissionDate: "12 Jul 2026",
  },

  "2": {
    id: "P002",
    patientName: "Priya Singh",
    uhid: "UHID-240015",
    age: 34,
    gender: "Female",
    diagnosis: "Diabetes Mellitus",
    consultant: "Dr. Anil Kumar",
    ward: "ICU",
    bedNumber: "B-102",
    admissionDate: "14 Jul 2026",
  },

  "3": {
    id: "P003",
    patientName: "Amit Singh",
    uhid: "UHID-240018",
    age: 45,
    gender: "Male",
    diagnosis: "Hypertension",
    consultant: "Dr. Neha Gupta",
    ward: "ICU",
    bedNumber: "B-103",
    admissionDate: "15 Jul 2026",
  },
};