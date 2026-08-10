import { Patient, PatientAdmissionContext } from "@/features/nurse/components/PatientDetails/PatientDetails.types";

export const patients: Record<string, Patient & PatientAdmissionContext> = {
  "1": {
    id: "P001",
    uhid: "UHID-240012",
    thid: null,
    full_name: "Rahul Sharma",
    sex: "male",
    dob: null,
    age_years: 52,
    guardian_name: null,
    guardian_relationship: null,
    mobile: null,
    // display-only, joined fields — not columns on `patients`
    ward_name: "General Ward",
    bed_number: "B-101",
    admitted_at: "2026-07-12T00:00:00Z",
    diagnosis_text: "Pneumonia",
  },
  "3": {
    id: "P002",
    uhid: "UHID-240018",
    thid: null,
    full_name: "Amit Singh",
    sex: "male",
    dob: null,
    age_years: 45,
    guardian_name: null,
    guardian_relationship: null,
    mobile: null,
    ward_name: "ICU",
    bed_number: "I-201",
    admitted_at: "2026-07-16T00:00:00Z",
    diagnosis_text: "Uncontrolled diabetes",
  },
};