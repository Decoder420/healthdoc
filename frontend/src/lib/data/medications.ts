import { MedicationRecord } from "@/components/shared/EMARTable";

export const medications: MedicationRecord[] = [
  {
    id: "1",
    medicationName: "Paracetamol",
    dosage: "500 mg",
    route: "Oral",
    scheduledTime: "08:00 AM",
    administeredBy: "Nurse Anita",
    status: "Administered",
  },
  {
    id: "2",
    medicationName: "Ceftriaxone",
    dosage: "1 g",
    route: "IV",
    scheduledTime: "12:00 PM",
    administeredBy: "",
    status: "Scheduled",
  },
  {
    id: "3",
    medicationName: "Pantoprazole",
    dosage: "40 mg",
    route: "IV",
    scheduledTime: "06:00 PM",
    administeredBy: "Nurse Rahul",
    status: "Held",
  },
];