import { MedicationRecord } from "@/components/tables/EMARTable";
import {
  ADMISSION_1_ID,
  NURSE_ANITA_ID,
  NURSE_RAHUL_ID,
  PATIENT_1_ID,
} from "./mockIds";

/**
 * eMAR rows — `medication_administration` (0043), what a nurse DID to a dose.
 *
 * This file previously held prescription_items (prescription_id, frequency,
 * duration_days, status: prescribed | dispensed | partially_dispensed) and fed
 * them to EMARTable. Those are two different tables answering two different
 * questions. A prescription says what a doctor ordered; an eMAR says what
 * reached the patient, and the gap between them is the entire clinical point of
 * the record. A ward reading "prescribed" on an eMAR cannot tell whether the
 * 14:00 dose was given.
 *
 * Keyed by admission_id, matching
 * `GET /nursing/admissions/{admission_id}/medication-administrations`.
 */
export const medications: MedicationRecord[] = [
  {
    id: "ae000001-0000-4000-8000-000000000001",
    prescription_item_id: "a8000000-0000-4000-8000-000000000001",
    admission_id: ADMISSION_1_ID,
    patient_id: PATIENT_1_ID,
    medicine_name: "Paracetamol",
    dosage: "500 mg",
    route: "oral",
    scheduled_at: "2026-07-22T08:00:00Z",
    administered_at: "2026-07-22T08:05:00Z",
    status: "given",
    dose_given: "500 mg",
    reason: null,
    notes: null,
    created_by: NURSE_ANITA_ID,
    created_at: "2026-07-22T08:05:00Z",
  },
  {
    id: "ae000001-0000-4000-8000-000000000002",
    prescription_item_id: "a8000000-0000-4000-8000-000000000002",
    admission_id: ADMISSION_1_ID,
    patient_id: PATIENT_1_ID,
    medicine_name: "Ceftriaxone",
    dosage: "1 g",
    route: "iv",
    scheduled_at: "2026-07-22T12:00:00Z",
    administered_at: "2026-07-22T12:10:00Z",
    // A staff decision, with the reason the API requires.
    status: "held",
    dose_given: null,
    reason: "Systolic 88; withheld pending review by the on-call doctor.",
    notes: null,
    created_by: NURSE_RAHUL_ID,
    created_at: "2026-07-22T12:10:00Z",
  },
  {
    id: "ae000001-0000-4000-8000-000000000003",
    prescription_item_id: "a8000000-0000-4000-8000-000000000003",
    admission_id: ADMISSION_1_ID,
    patient_id: PATIENT_1_ID,
    medicine_name: "Pantoprazole",
    dosage: "40 mg",
    route: "iv",
    scheduled_at: "2026-07-22T20:00:00Z",
    administered_at: "2026-07-22T20:15:00Z",
    // The patient's decision — deliberately a different row from `held`, so the
    // table exercises the distinction the schema insists on.
    status: "refused",
    dose_given: null,
    reason: "Patient declined; nausea after the previous dose.",
    notes: null,
    created_by: NURSE_ANITA_ID,
    created_at: "2026-07-22T20:15:00Z",
  },
];
