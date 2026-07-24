// import { MedicationRecord } from "@/components/shared/EMARTable";

// export const medications: MedicationRecord[] = [
//   {
//     id: "1",
//     medicationName: "Paracetamol",
//     dosage: "500 mg",
//     route: "Oral",
//     scheduledTime: "08:00 AM",
//     administeredBy: "Nurse Anita",
//     status: "Administered",
//   },
//   {
//     id: "2",
//     medicationName: "Ceftriaxone",
//     dosage: "1 g",
//     route: "IV",
//     scheduledTime: "12:00 PM",
//     administeredBy: "",
//     status: "Scheduled",
//   },
//   {
//     id: "3",
//     medicationName: "Pantoprazole",
//     dosage: "40 mg",
//     route: "IV",
//     scheduledTime: "06:00 PM",
//     administeredBy: "Nurse Rahul",
//     status: "Held",
//   },
// ];

import { MedicationRecord } from "@/components/tables/EMARTable";

export const medications: MedicationRecord[] = [
  {
    id: "1",
    prescription_id: "rx-1",
    medicine_item_id: null,
    medicine_name: "Paracetamol",
    dosage: "500 mg",
    frequency: "Thrice daily",
    duration_days: 5,
    route: "Oral",
    instructions: null,
    status: "administered",
  },
  {
    id: "2",
    prescription_id: "rx-1",
    medicine_item_id: null,
    medicine_name: "Ceftriaxone",
    dosage: "1 g",
    frequency: "Once daily",
    duration_days: 3,
    route: "IV",
    instructions: null,
    status: "prescribed",
  },
  {
    id: "3",
    prescription_id: "rx-1",
    medicine_item_id: null,
    medicine_name: "Pantoprazole",
    dosage: "40 mg",
    frequency: "Once daily",
    duration_days: 5,
    route: "IV",
    instructions: null,
    status: "held",
  },
];