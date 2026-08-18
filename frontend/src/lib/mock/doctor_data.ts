/**
 * Doctor module mock seed data until backend APIs are connected.
 * Feature APIs (features/doctor/api/*) import from here — keep seed data out of features/.
 *
 * Shapes mirror real tables: queue_tokens carries only token columns (plus the
 * patient columns a list endpoint would join for display), while clinical facts
 * live on their own rows — patients, history, allergies.
 */
import type {
  Allergy,
  CreateDiagnosisInput,
  CreateOrderInput,
  CreatePrescriptionInput,
  EncounterContext,
  IcdConcept,
  Medicine,
  Patient,
  PatientHistoryEntry,
  QueueToken,
  VitalsInput,
} from "@/features/doctor/types";
import {
  MOCK_DEPARTMENT,
  MOCK_PROVIDER_NAME,
  MOCK_PROVIDER_USER_ID,
} from "@/features/doctor/constants";

// --- In-memory write stores (records created during the mock session) ------

export const savedVitals: VitalsInput[] = [];
export const savedDiagnoses: CreateDiagnosisInput[] = [];
export const placedOrders: CreateOrderInput[] = [];
export const savedPrescriptions: CreatePrescriptionInput[] = [];

/** Minutes ago → ISO, so wait time is derived from created_at, never stored. */
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

// --- Patients (patients) ---------------------------------------------------

export const mockPatientRecords: Patient[] = [
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1001", uhid: "IN-RJ-JPR001-2026-000041-3", full_name: "Ramesh Kumar", sex: "male", age_years: 68, mobile: "98290 11041" },
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1002", uhid: "IN-RJ-JPR001-2026-000042-7", full_name: "Sita Devi", sex: "female", age_years: 28, mobile: "98290 11042" },
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1003", uhid: "IN-RJ-JPR001-2026-000043-1", full_name: "Arjun Singh", sex: "male", age_years: 34, mobile: "98290 11043" },
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1004", uhid: "IN-RJ-JPR001-2026-000044-9", full_name: "Meena Patel", sex: "female", age_years: 45, mobile: "98290 11044" },
  // Emergency path: THID only, no UHID yet.
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1005", thid: "TH-JPR001-260817-0007", full_name: "Vikram Malhotra", sex: "male", age_years: 52 },
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1006", uhid: "IN-RJ-JPR001-2026-000046-4", full_name: "Pooja Sharma", sex: "female", age_years: 39, mobile: "98290 11046" },
  { id: "9f1a3c52-0e11-4c8a-9b21-2f7d4a6c1007", uhid: "IN-RJ-JPR001-2026-000047-8", full_name: "Suresh Nair", sex: "male", age_years: 61, mobile: "98290 11047" },
];

const patientLabel = (id: string) => {
  const p = mockPatientRecords.find((x) => x.id === id);
  return { name: p?.full_name ?? "Unknown", ident: p?.uhid ?? p?.thid ?? "—", age: p?.age_years ?? 0, sex: p?.sex ?? "unknown" };
};

// --- Queue tokens (queue_tokens) -------------------------------------------

export const mockDoctorQueue: QueueToken[] = [
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000045", token_display: "MED-045", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000005", patient_id: mockPatientRecords[4].id, status: "waiting", priority: "emergency", created_at: minutesAgo(2), full_name: "Vikram Malhotra", uhid: "TH-JPR001-260817-0007", age_years: 52, sex: "male" },
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000046", token_display: "MED-046", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000006", patient_id: mockPatientRecords[5].id, status: "recalled", priority: "doctor_recall", created_at: minutesAgo(6), full_name: "Pooja Sharma", uhid: "IN-RJ-JPR001-2026-000046-4", age_years: 39, sex: "female" },
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000041", token_display: "MED-041", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000001", patient_id: mockPatientRecords[0].id, status: "waiting", priority: "senior_citizen", created_at: minutesAgo(12), full_name: "Ramesh Kumar", uhid: "IN-RJ-JPR001-2026-000041-3", age_years: 68, sex: "male" },
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000042", token_display: "MED-042", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000002", patient_id: mockPatientRecords[1].id, status: "called", priority: "pregnant", created_at: minutesAgo(4), called_at: minutesAgo(1), full_name: "Sita Devi", uhid: "IN-RJ-JPR001-2026-000042-7", age_years: 28, sex: "female" },
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000044", token_display: "MED-044", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000004", patient_id: mockPatientRecords[3].id, status: "skipped", priority: "normal", created_at: minutesAgo(25), full_name: "Meena Patel", uhid: "IN-RJ-JPR001-2026-000044-9", age_years: 45, sex: "female" },
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000043", token_display: "MED-043", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000003", patient_id: mockPatientRecords[2].id, status: "in_service", priority: "normal", created_at: minutesAgo(0), full_name: "Arjun Singh", uhid: "IN-RJ-JPR001-2026-000043-1", age_years: 34, sex: "male" },
  { id: "3b0c9e17-5a44-4d2e-8c31-a10000000047", token_display: "MED-047", visit_id: "7c2e5f90-1b33-4a77-9d05-b20000000007", patient_id: mockPatientRecords[6].id, status: "completed", priority: "normal", created_at: minutesAgo(80), completed_at: minutesAgo(35), full_name: "Suresh Nair", uhid: "IN-RJ-JPR001-2026-000047-8", age_years: 61, sex: "male" },
];

// --- Patient history (GET /patients/{id}/history) --------------------------

export const mockPatientHistory: Record<string, PatientHistoryEntry[]> = {
  [mockPatientRecords[0].id]: [
    { visit_id: "old-1", visit_number: "VST-JPR001-20260418-00121", visit_date: "2026-04-18", department: "General Medicine", diagnoses: ["Essential hypertension", "Type 2 diabetes mellitus"] },
  ],
  [mockPatientRecords[2].id]: [
    { visit_id: "old-2", visit_number: "VST-JPR001-20260418-00133", visit_date: "2026-04-18", department: "General Medicine", diagnoses: ["Allergic rhinitis"] },
  ],
  [mockPatientRecords[3].id]: [
    { visit_id: "old-3", visit_number: "VST-JPR001-20260322-00098", visit_date: "2026-03-22", department: "General Medicine", diagnoses: ["Iron deficiency anaemia"] },
  ],
};

// --- Allergies (allergies, schema 0032) ------------------------------------
// Matching is on ingredient_code. A row without one is "unknown", never "clear".

export const mockAllergies: Allergy[] = [
  { id: "a1", patient_id: mockPatientRecords[2].id, allergen_type: "drug", substance_text: "Sulfa drugs", ingredient_code: "SULFONAMIDE", reaction: "Rash", severity: "moderate", status: "active", recorded_by: MOCK_PROVIDER_USER_ID },
  { id: "a2", patient_id: mockPatientRecords[2].id, allergen_type: "drug", substance_text: "Aspirin", ingredient_code: "ASPIRIN", reaction: "Wheezing", severity: "severe", status: "active", recorded_by: MOCK_PROVIDER_USER_ID },
  { id: "a3", patient_id: mockPatientRecords[0].id, allergen_type: "drug", substance_text: "Penicillin injection", ingredient_code: "PENICILLIN", reaction: "Collapse", severity: "anaphylaxis", status: "active", onset_date: "2019-06-02", recorded_by: MOCK_PROVIDER_USER_ID },
  // Uncoded on purpose: the check cannot run, so the UI must warn, not clear.
  { id: "a4", patient_id: mockPatientRecords[1].id, allergen_type: "drug", substance_text: "Some painkiller, name not known", severity: "moderate", status: "active", recorded_by: MOCK_PROVIDER_USER_ID },
  { id: "a5", patient_id: mockPatientRecords[1].id, allergen_type: "food", substance_text: "Prawns", reaction: "Hives", severity: "mild", status: "active", recorded_by: MOCK_PROVIDER_USER_ID },
  // Corrected, not deleted — must not appear in prescribing checks.
  { id: "a6", patient_id: mockPatientRecords[0].id, allergen_type: "drug", substance_text: "Ibuprofen", ingredient_code: "IBUPROFEN", severity: "mild", status: "refuted", recorded_by: MOCK_PROVIDER_USER_ID },
];

// --- Encounter context -----------------------------------------------------

export function encounterContextFor(token: QueueToken): EncounterContext {
  const p = patientLabel(token.patient_id);
  return {
    visit_id: token.visit_id,
    patient_id: token.patient_id,
    patient_name: p.name,
    uhid: p.ident,
    age_years: p.age,
    sex: p.sex,
    provider_user_id: MOCK_PROVIDER_USER_ID,
    provider_name: MOCK_PROVIDER_NAME,
    department: MOCK_DEPARTMENT,
    token_display: token.token_display,
  };
}

/** Default context for the standalone consultation route (first in-service token). */
export const mockEncounterContext: EncounterContext = encounterContextFor(
  mockDoctorQueue.find((t) => t.status === "in_service") ?? mockDoctorQueue[0],
);

// --- ICD catalog (icd_codes / WHO ICD-API) ---------------------------------

export const mockIcdConcepts: IcdConcept[] = [
  { code: "CA07.0", version: "icd11", title: "Acute upper respiratory infection", icd_uri: "http://id.who.int/icd/entity/1435254666" },
  { code: "BA00", version: "icd11", title: "Essential hypertension", icd_uri: "http://id.who.int/icd/entity/1611781216" },
  { code: "5A11", version: "icd11", title: "Type 2 diabetes mellitus", icd_uri: "http://id.who.int/icd/entity/1211013223", is_postcoordinable: true },
  { code: "DA22.Z", version: "icd11", title: "Gastro-oesophageal reflux disease" },
  { code: "8A80", version: "icd11", title: "Headache" },
  { code: "CA23", version: "icd11", title: "Asthma", is_postcoordinable: true },
  { code: "ME84.2", version: "icd11", title: "Low back pain" },
  { code: "1F40", version: "icd11", title: "Enteric fever (typhoid)" },
  { code: "I10", version: "icd10", title: "Essential (primary) hypertension" },
  { code: "E11.9", version: "icd10", title: "Type 2 diabetes mellitus, without complications" },
  { code: "J06.9", version: "icd10", title: "Acute upper respiratory infection, unspecified" },
];

// --- Order suggestions -----------------------------------------------------
// Plain name lists for the pickers. There is NO catalog table in the schema, so
// nothing here has an id the order references — the chosen text is written to
// lab_order_items.test_name / radiology_order_items.scan_type / procedures.procedure_name.

export const labTestNames = [
  "Complete Blood Count (CBC)",
  "Fasting Blood Sugar",
  "Liver Function Test",
  "Kidney Function Test",
  "Thyroid Profile (T3, T4, TSH)",
  "HbA1c",
];

export const radiologyScanTypes = [
  "Chest X-Ray (PA view)",
  "Ultrasound — Abdomen",
  "CT — Head (plain)",
  "MRI — Lumbar spine",
];

export const procedureNames = [
  "Wound Dressing",
  "IV Cannulation",
  "Nebulization",
  "Suturing (minor)",
];

// --- Medicines (inventory_items subset) ------------------------------------
// ingredient_code is what the allergy check matches on — two brands sharing an
// ingredient must both trip the same allergy.

export const mockMedicines: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", generic_name: "Paracetamol", ingredient_code: "PARACETAMOL", strength: "500 mg", form: "tablet", is_controlled_drug: false },
  { id: "m2", name: "Amoxicillin 500mg", generic_name: "Amoxicillin", ingredient_code: "PENICILLIN", strength: "500 mg", form: "capsule", is_controlled_drug: false },
  { id: "m3", name: "Azithromycin 250mg", generic_name: "Azithromycin", ingredient_code: "AZITHROMYCIN", strength: "250 mg", form: "tablet", is_controlled_drug: false },
  { id: "m4", name: "Metformin 500mg", generic_name: "Metformin", ingredient_code: "METFORMIN", strength: "500 mg", form: "tablet", is_controlled_drug: false },
  { id: "m5", name: "Amlodipine 5mg", generic_name: "Amlodipine", ingredient_code: "AMLODIPINE", strength: "5 mg", form: "tablet", is_controlled_drug: false },
  { id: "m6", name: "Aspirin 75mg", generic_name: "Aspirin", ingredient_code: "ASPIRIN", strength: "75 mg", form: "tablet", is_controlled_drug: false },
  { id: "m7", name: "Co-trimoxazole DS", generic_name: "Sulfamethoxazole + Trimethoprim", ingredient_code: "SULFONAMIDE", strength: "800/160 mg", form: "tablet", is_controlled_drug: false },
  { id: "m8", name: "Ibuprofen 400mg", generic_name: "Ibuprofen", ingredient_code: "IBUPROFEN", strength: "400 mg", form: "tablet", is_controlled_drug: false },
  { id: "m9", name: "Salbutamol Inhaler", generic_name: "Salbutamol", ingredient_code: "SALBUTAMOL", strength: "100 mcg/dose", form: "consumable", is_controlled_drug: false },
  { id: "m10", name: "Tramadol 50mg", generic_name: "Tramadol", ingredient_code: "TRAMADOL", strength: "50 mg", form: "capsule", is_controlled_drug: true },
  { id: "m11", name: "Ampicillin 500mg Injection", generic_name: "Ampicillin", ingredient_code: "PENICILLIN", strength: "500 mg", form: "injection", is_controlled_drug: false },
  // No ingredient_code on purpose: the allergy check cannot run for this item.
  { id: "m12", name: "Ayurvedic cough syrup (local)", generic_name: "Mixed herbal", strength: "100 ml", form: "syrup", is_controlled_drug: false },
];
