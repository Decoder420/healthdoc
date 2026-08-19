import { MedicationRecord } from "@/components/tables/EMARTable";
import { PRESCRIPTION_1_ID } from "./mockIds";

export const medications: MedicationRecord[] = [
  {
    id: "ae000001-0000-4000-8000-000000000001",
    prescription_id: PRESCRIPTION_1_ID,
    medicine_item_id: null,
    medicine_name: "Paracetamol",
    dosage: "500 mg",
    frequency: "Thrice daily",
    duration_days: 5,
    route: "Oral",
    instructions: null,
    status: "dispensed",
  },
  {
    id: "ae000001-0000-4000-8000-000000000002",
    prescription_id: PRESCRIPTION_1_ID,
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
    id: "ae000001-0000-4000-8000-000000000003",
    prescription_id: PRESCRIPTION_1_ID,
    medicine_item_id: null,
    medicine_name: "Pantoprazole",
    dosage: "40 mg",
    frequency: "Once daily",
    duration_days: 5,
    route: "IV",
    instructions: null,
    status: "partially_dispensed",
  },
];
