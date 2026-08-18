/**
 * Week 5 results seed — lab_results / radiology_reports (append-only, versioned)
 * and doctor_reviews.
 *
 * `result_data` is deliberately just JSON. The schema declares it `jsonb` with
 * no inner shape, so the mock carries realistic-but-arbitrary keys and the
 * viewer renders whatever is there. No invented range/flag contract.
 */
import type {
  DoctorReview,
  LabResult,
  RadiologyReport,
  ResultWorklistItem,
} from "@/features/doctor/types";

import { MOCK_PROVIDER_NAME, MOCK_PROVIDER_USER_ID } from "@/features/doctor/constants";

const PATHOLOGIST = "Dr. K. Menon";
const RADIOLOGIST = "Dr. S. Iyer";
const ENCOUNTER_ID = "e1000000-0000-4000-8000-000000000001";

/** Reviews created during the mock session (stand-in for the table). */
export const savedDoctorReviews: DoctorReview[] = [];

// --- Worklist ---------------------------------------------------------------

export const mockResultsWorklist: ResultWorklistItem[] = [
  { id: "loi-001", order_id: "ord-001", order_number: "ORD-20260731-000101", order_type: "lab", accession_number: "LAB-20260731-00042", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1001", patient_name: "Ramesh Kumar", uhid: "IN-RJ-JPR001-2026-000041-3", test_name: "Complete Blood Count (CBC)", priority: "routine", status: "completed", result_status: "final", reported_at: "2026-07-31T09:42:00Z" },
  { id: "loi-002", order_id: "ord-002", order_number: "ORD-20260731-000102", order_type: "lab", accession_number: "LAB-20260731-00043", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1005", patient_name: "Vikram Malhotra", uhid: "TH-JPR001-260817-0007", test_name: "Serum Electrolytes", priority: "stat", status: "completed", result_status: "final", reported_at: "2026-07-31T10:05:00Z" },
  { id: "loi-003", order_id: "ord-003", order_number: "ORD-20260731-000103", order_type: "lab", accession_number: "LAB-20260731-00044", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1003", patient_name: "Arjun Singh", uhid: "IN-RJ-JPR001-2026-000043-1", test_name: "Liver Function Test", priority: "routine", status: "completed", result_status: "corrected", reported_at: "2026-07-31T11:20:00Z", review_status: "signed_off" },
  { id: "loi-004", order_id: "ord-004", order_number: "ORD-20260731-000104", order_type: "lab", accession_number: "LAB-20260731-00045", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1002", patient_name: "Sita Devi", uhid: "IN-RJ-JPR001-2026-000042-7", test_name: "Thyroid Profile (T3, T4, TSH)", priority: "routine", status: "in_progress" },
  { id: "roi-001", order_id: "ord-005", order_number: "ORD-20260731-000105", order_type: "radiology", accession_number: "RAD-20260731-00018", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1001", patient_name: "Ramesh Kumar", uhid: "IN-RJ-JPR001-2026-000041-3", test_name: "Chest X-Ray (PA view)", modality: "xray", priority: "routine", status: "completed", result_status: "final", reported_at: "2026-07-31T10:35:00Z" },
  { id: "roi-002", order_id: "ord-006", order_number: "ORD-20260731-000106", order_type: "radiology", accession_number: "RAD-20260731-00019", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1005", patient_name: "Vikram Malhotra", uhid: "TH-JPR001-260817-0007", test_name: "CT — Head (plain)", modality: "ct", priority: "urgent", status: "completed", result_status: "preliminary", reported_at: "2026-07-31T10:50:00Z", review_status: "reviewed" },
  { id: "roi-003", order_id: "ord-007", order_number: "ORD-20260731-000107", order_type: "radiology", accession_number: "RAD-20260731-00020", patient_id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1006", patient_name: "Pooja Sharma", uhid: "IN-RJ-JPR001-2026-000046-4", test_name: "Ultrasound — Abdomen", modality: "usg", priority: "routine", status: "accepted" },
];

// --- Lab results (versioned; corrections are new rows) ----------------------

export const mockLabResults: LabResult[] = [
  {
    id: "lr-001", lab_order_item_id: "loi-001", version: 1, is_current: true, status: "final",
    created_by: "u-path-1", created_by_name: PATHOLOGIST, created_at: "2026-07-31T09:42:00Z",
    remarks: "Sample haemolysed slightly; values within acceptable limits.",
    result_data: {
      Haemoglobin: "11.2 g/dL", "RBC count": "4.4 x10^6/µL", "WBC count": "8.1 x10^3/µL",
      "Platelet count": "245 x10^3/µL", Haematocrit: "34.8 %",
    },
  },
  {
    id: "lr-002", lab_order_item_id: "loi-002", version: 1, is_current: true, status: "final",
    created_by: "u-path-1", created_by_name: PATHOLOGIST, created_at: "2026-07-31T10:05:00Z",
    remarks: "Critical potassium — treating team informed by phone at 10:07.",
    result_data: {
      Potassium: "6.8 mmol/L", Sodium: "133 mmol/L", Chloride: "101 mmol/L",
      Bicarbonate: "19 mmol/L",
    },
  },
  {
    id: "lr-003a", lab_order_item_id: "loi-003", version: 1, is_current: false, status: "final",
    created_by: "u-path-2", created_by_name: "Dr. R. Bose", created_at: "2026-07-31T10:40:00Z",
    result_data: { "Total bilirubin": "2.4 mg/dL", "ALT (SGPT)": "78 U/L", "AST (SGOT)": "65 U/L" },
  },
  {
    id: "lr-003b", lab_order_item_id: "loi-003", version: 2, is_current: true, status: "corrected",
    created_by: "u-path-1", created_by_name: PATHOLOGIST, created_at: "2026-07-31T11:20:00Z",
    remarks: "Corrected: total bilirubin re-run on a fresh aliquot (v1 reported 2.4).",
    result_data: {
      "Total bilirubin": "1.6 mg/dL", "ALT (SGPT)": "78 U/L", "AST (SGOT)": "65 U/L",
      "Alkaline phosphatase": "112 U/L", HBsAg: "Negative",
    },
  },
];

// --- Radiology reports ------------------------------------------------------

export const mockRadiologyReports: RadiologyReport[] = [
  {
    id: "rr-001", radiology_order_item_id: "roi-001", version: 1, is_current: true, status: "final",
    created_by: "u-rad-1", created_by_name: RADIOLOGIST, created_at: "2026-07-31T10:35:00Z",
    pacs_study_uid: "1.2.840.113619.2.55.3.604688654.835.1753948800.101",
    findings:
      "Both lung fields are clear. No focal consolidation, cavitation or pleural effusion. " +
      "Cardiac silhouette is normal in size and contour. Both hila are normal in size and density. " +
      "The trachea is central. Bony thoracic cage and soft tissues appear unremarkable.",
    impression: "Normal chest radiograph. No active cardiopulmonary disease.",
  },
  {
    id: "rr-002", radiology_order_item_id: "roi-002", version: 1, is_current: true, status: "preliminary",
    created_by: "u-rad-2", created_by_name: "Dr. A. Fernandes", created_at: "2026-07-31T10:50:00Z",
    pacs_study_uid: "1.2.840.113619.2.55.3.604688654.835.1753948800.207",
    findings:
      "Plain CT of the brain shows no evidence of acute intracranial haemorrhage, " +
      "mass effect or midline shift. Ventricular system is normal in size and configuration. " +
      "Grey-white differentiation is preserved. Mild age-related cortical atrophy is noted.",
    impression:
      "No acute intracranial abnormality. Mild cortical atrophy. " +
      "PRELIMINARY report — pending review by the reporting consultant.",
  },
];

// --- Existing doctor_reviews ------------------------------------------------

export const mockDoctorReviews: DoctorReview[] = [
  {
    id: "rev-001", encounter_id: ENCOUNTER_ID, reviewed_by: MOCK_PROVIDER_USER_ID,
    reviewed_by_name: MOCK_PROVIDER_NAME, lab_order_item_id: "loi-003", status: "signed_off",
    notes: "Corrected bilirubin noted. Continue current management, repeat LFT in 1 week.",
    signed_off_at: "2026-07-31T11:55:00Z",
    created_at: "2026-07-31T11:50:00Z", updated_at: "2026-07-31T11:55:00Z",
  },
  {
    id: "rev-002", encounter_id: ENCOUNTER_ID, reviewed_by: MOCK_PROVIDER_USER_ID,
    reviewed_by_name: MOCK_PROVIDER_NAME, radiology_order_item_id: "roi-002", status: "reviewed",
    notes: "Seen. Awaiting the final consultant report before signing off.",
    created_at: "2026-07-31T11:05:00Z", updated_at: "2026-07-31T11:05:00Z",
  },
];

export const MOCK_ENCOUNTER_ID_FOR_REVIEWS = ENCOUNTER_ID;
