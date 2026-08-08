/**
 * Week 5 results seed data — lab_results / radiology_reports and their order items.
 *
 * The `result_data` payloads follow the PROVISIONAL shape in features/doctor/types.ts
 * (schema v3.13 declares only `jsonb NOT NULL`). Replace this file and the types
 * block together once B5 publishes the real contract.
 */
import type {
  LabResult,
  RadiologyReport,
  ResultAcknowledgement,
  ResultWorklistItem,
} from "@/features/doctor/types";

import { MOCK_PROVIDER_NAME, MOCK_PROVIDER_USER_ID } from "@/features/doctor/constants";

const PATHOLOGIST = "Dr. K. Menon";
const RADIOLOGIST = "Dr. S. Iyer";

/** Acknowledgements created during the mock session (stand-in for the table). */
export const savedAcknowledgements: ResultAcknowledgement[] = [];

// --- Worklist ---------------------------------------------------------------

export const mockResultsWorklist: ResultWorklistItem[] = [
  {
    id: "loi-001",
    order_id: "ord-001",
    order_number: "ORD-20260731-000101",
    order_type: "lab",
    accession_number: "LAB-20260731-00042",
    patient_id: "p-1001",
    patient_name: "Ramesh Kumar",
    uhid: "UH1001",
    test_name: "Complete Blood Count (CBC)",
    priority: "routine",
    status: "completed",
    result_status: "final",
    has_critical: false,
    reported_at: "2026-07-31T09:42:00Z",
  },
  {
    id: "loi-002",
    order_id: "ord-002",
    order_number: "ORD-20260731-000102",
    order_type: "lab",
    accession_number: "LAB-20260731-00043",
    patient_id: "p-1005",
    patient_name: "Vikram Malhotra",
    uhid: "UH1005",
    test_name: "Serum Electrolytes",
    priority: "stat",
    status: "completed",
    result_status: "final",
    has_critical: true,
    reported_at: "2026-07-31T10:05:00Z",
  },
  {
    id: "loi-003",
    order_id: "ord-003",
    order_number: "ORD-20260731-000103",
    order_type: "lab",
    accession_number: "LAB-20260731-00044",
    patient_id: "p-1003",
    patient_name: "Arjun Singh",
    uhid: "UH1003",
    test_name: "Liver Function Test",
    priority: "routine",
    status: "completed",
    result_status: "corrected",
    has_critical: false,
    reported_at: "2026-07-31T11:20:00Z",
    acknowledged_at: "2026-07-31T11:55:00Z",
  },
  {
    id: "loi-004",
    order_id: "ord-004",
    order_number: "ORD-20260731-000104",
    order_type: "lab",
    accession_number: "LAB-20260731-00045",
    patient_id: "p-1002",
    patient_name: "Sita Devi",
    uhid: "UH1002",
    test_name: "Thyroid Profile (T3, T4, TSH)",
    priority: "routine",
    status: "in_progress",
    has_critical: false,
  },
  {
    id: "roi-001",
    order_id: "ord-005",
    order_number: "ORD-20260731-000105",
    order_type: "radiology",
    accession_number: "RAD-20260731-00018",
    patient_id: "p-1001",
    patient_name: "Ramesh Kumar",
    uhid: "UH1001",
    test_name: "Chest X-Ray (PA view)",
    modality: "xray",
    priority: "routine",
    status: "completed",
    result_status: "final",
    has_critical: false,
    reported_at: "2026-07-31T10:35:00Z",
  },
  {
    id: "roi-002",
    order_id: "ord-006",
    order_number: "ORD-20260731-000106",
    order_type: "radiology",
    accession_number: "RAD-20260731-00019",
    patient_id: "p-1005",
    patient_name: "Vikram Malhotra",
    uhid: "UH1005",
    test_name: "CT — Head (plain)",
    modality: "ct",
    priority: "urgent",
    status: "completed",
    result_status: "preliminary",
    has_critical: false,
    reported_at: "2026-07-31T10:50:00Z",
  },
  {
    id: "roi-003",
    order_id: "ord-007",
    order_number: "ORD-20260731-000107",
    order_type: "radiology",
    accession_number: "RAD-20260731-00020",
    patient_id: "p-1006",
    patient_name: "Pooja Sharma",
    uhid: "UH1006",
    test_name: "Ultrasound — Abdomen",
    modality: "usg",
    priority: "routine",
    status: "accepted",
    has_critical: false,
  },
];

// --- Lab results (versioned; only is_current shown by default) ---------------

export const mockLabResults: LabResult[] = [
  {
    id: "lr-001",
    lab_order_item_id: "loi-001",
    version: 1,
    is_current: true,
    status: "final",
    created_by: "u-path-1",
    created_by_name: PATHOLOGIST,
    created_at: "2026-07-31T09:42:00Z",
    remarks: "Sample haemolysed slightly; values within acceptable limits.",
    result_data: {
      analytes: [
        { code: "718-7", name: "Haemoglobin", value: "11.2", unit: "g/dL", ref_low: 13, ref_high: 17, flag: "low" },
        { code: "789-8", name: "RBC count", value: "4.4", unit: "10^6/µL", ref_low: 4.5, ref_high: 5.9, flag: "low" },
        { code: "6690-2", name: "WBC count", value: "8.1", unit: "10^3/µL", ref_low: 4, ref_high: 11, flag: "normal" },
        { code: "777-3", name: "Platelet count", value: "245", unit: "10^3/µL", ref_low: 150, ref_high: 410, flag: "normal" },
        { code: "4544-3", name: "Haematocrit", value: "34.8", unit: "%", ref_low: 40, ref_high: 52, flag: "low" },
      ],
    },
  },
  {
    id: "lr-002",
    lab_order_item_id: "loi-002",
    version: 1,
    is_current: true,
    status: "final",
    created_by: "u-path-1",
    created_by_name: PATHOLOGIST,
    created_at: "2026-07-31T10:05:00Z",
    remarks: "Critical potassium — treating team informed by phone at 10:07.",
    result_data: {
      analytes: [
        { code: "2823-3", name: "Potassium", value: "6.8", unit: "mmol/L", ref_low: 3.5, ref_high: 5.1, flag: "critical_high" },
        { code: "2951-2", name: "Sodium", value: "133", unit: "mmol/L", ref_low: 136, ref_high: 145, flag: "low" },
        { code: "2075-0", name: "Chloride", value: "101", unit: "mmol/L", ref_low: 98, ref_high: 107, flag: "normal" },
        { code: "1963-8", name: "Bicarbonate", value: "19", unit: "mmol/L", ref_low: 22, ref_high: 29, flag: "low" },
      ],
    },
  },
  {
    id: "lr-003a",
    lab_order_item_id: "loi-003",
    version: 1,
    is_current: false,
    status: "final",
    created_by: "u-path-2",
    created_by_name: "Dr. R. Bose",
    created_at: "2026-07-31T10:40:00Z",
    result_data: {
      analytes: [
        { code: "1975-2", name: "Total bilirubin", value: "2.4", unit: "mg/dL", ref_low: 0.3, ref_high: 1.2, flag: "high" },
        { code: "1742-6", name: "ALT (SGPT)", value: "78", unit: "U/L", ref_low: 7, ref_high: 56, flag: "high" },
        { code: "1920-8", name: "AST (SGOT)", value: "65", unit: "U/L", ref_low: 10, ref_high: 40, flag: "high" },
      ],
    },
  },
  {
    id: "lr-003b",
    lab_order_item_id: "loi-003",
    version: 2,
    is_current: true,
    status: "corrected",
    created_by: "u-path-1",
    created_by_name: PATHOLOGIST,
    created_at: "2026-07-31T11:20:00Z",
    remarks: "Corrected: total bilirubin re-run on a fresh aliquot (v1 reported 2.4).",
    result_data: {
      analytes: [
        { code: "1975-2", name: "Total bilirubin", value: "1.6", unit: "mg/dL", ref_low: 0.3, ref_high: 1.2, flag: "high" },
        { code: "1742-6", name: "ALT (SGPT)", value: "78", unit: "U/L", ref_low: 7, ref_high: 56, flag: "high" },
        { code: "1920-8", name: "AST (SGOT)", value: "65", unit: "U/L", ref_low: 10, ref_high: 40, flag: "high" },
        { code: "6768-6", name: "Alkaline phosphatase", value: "112", unit: "U/L", ref_low: 44, ref_high: 147, flag: "normal" },
        { code: "5195-3", name: "HBsAg", value: "Negative", ref_text: "Negative", flag: "normal" },
      ],
    },
  },
];

// --- Radiology reports ------------------------------------------------------

export const mockRadiologyReports: RadiologyReport[] = [
  {
    id: "rr-001",
    radiology_order_item_id: "roi-001",
    version: 1,
    is_current: true,
    status: "final",
    created_by: "u-rad-1",
    created_by_name: RADIOLOGIST,
    created_at: "2026-07-31T10:35:00Z",
    pacs_study_uid: "1.2.840.113619.2.55.3.604688654.835.1753948800.101",
    findings:
      "Both lung fields are clear. No focal consolidation, cavitation or pleural effusion. " +
      "Cardiac silhouette is normal in size and contour. Both hila are normal in size and density. " +
      "The trachea is central. Bony thoracic cage and soft tissues appear unremarkable.",
    impression: "Normal chest radiograph. No active cardiopulmonary disease.",
  },
  {
    id: "rr-002",
    radiology_order_item_id: "roi-002",
    version: 1,
    is_current: true,
    status: "preliminary",
    created_by: "u-rad-2",
    created_by_name: "Dr. A. Fernandes",
    created_at: "2026-07-31T10:50:00Z",
    pacs_study_uid: "1.2.840.113619.2.55.3.604688654.835.1753948800.207",
    findings:
      "Plain CT of the brain shows no evidence of acute intracranial haemorrhage, " +
      "mass effect or midline shift. Ventricular system is normal in size and configuration. " +
      "Grey-white differentiation is preserved. Mild age-related cortical atrophy is noted. " +
      "No obvious infarct in the territories examined; correlate clinically.",
    impression:
      "No acute intracranial abnormality. Mild cortical atrophy. " +
      "PRELIMINARY report — pending review by the reporting consultant.",
  },
];

// --- Existing acknowledgements ---------------------------------------------

export const mockAcknowledgements: ResultAcknowledgement[] = [
  {
    id: "ack-001",
    lab_result_id: "lr-003b",
    reviewed_by: MOCK_PROVIDER_USER_ID,
    reviewed_by_name: MOCK_PROVIDER_NAME,
    reviewed_at: "2026-07-31T11:55:00Z",
    note: "Corrected bilirubin noted. Continue current management, repeat LFT in 1 week.",
  },
];
