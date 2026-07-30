/**
 * Doctor module mock seed data until backend APIs are connected.
 * Feature APIs (features/doctor/api/*) import from here — keep seed data out of features/.
 * Field names mirror schema v3.5 §3.
 */
import type {
  CatalogItem,
  CreateDiagnosisInput,
  CreateOrderInput,
  CreatePrescriptionInput,
  EncounterContext,
  IcdConcept,
  Medicine,
  QueuePatient,
  VitalsInput,
} from "@/features/doctor/types";
import {
  MOCK_DEPARTMENT,
  MOCK_PROVIDER_NAME,
  MOCK_PROVIDER_USER_ID,
} from "@/features/doctor/constants";

// --- In-memory write stores (records created during the mock session) ------
// Stand-ins for the backend tables until the real APIs land; the api layer
// pushes here so mutations are observable and inputs are actually consumed.

export const savedVitals: VitalsInput[] = [];
export const savedDiagnoses: CreateDiagnosisInput[] = [];
export const placedOrders: CreateOrderInput[] = [];
export const savedPrescriptions: CreatePrescriptionInput[] = [];

// --- Queue -----------------------------------------------------------------

export const mockDoctorQueue: QueuePatient[] = [
  {
    id: "q-0001",
    token_display: "MED-041",
    visit_id: "v-5001",
    patient_id: "p-1001",
    full_name: "Ramesh Kumar",
    uhid: "UH1001",
    age_years: 68,
    sex: "male",
    status: "waiting",
    priority: "senior_citizen",
    wait_minutes: 12,
    last_visit_date: "2026-05-02",
    previous_diagnoses: ["Essential hypertension", "Type 2 diabetes mellitus"],
    known_allergies: ["Penicillin"],
  },
  {
    id: "q-0002",
    token_display: "MED-042",
    visit_id: "v-5002",
    patient_id: "p-1002",
    full_name: "Sita Devi",
    uhid: "UH1002",
    age_years: 28,
    sex: "female",
    status: "called",
    priority: "pregnant",
    wait_minutes: 4,
    last_visit_date: "2026-06-10",
    previous_diagnoses: [],
    known_allergies: [],
  },
  {
    id: "q-0003",
    token_display: "MED-043",
    visit_id: "v-5003",
    patient_id: "p-1003",
    full_name: "Arjun Singh",
    uhid: "UH1003",
    age_years: 34,
    sex: "male",
    status: "in_service",
    priority: "normal",
    wait_minutes: 0,
    last_visit_date: "2026-04-18",
    previous_diagnoses: ["Allergic rhinitis"],
    known_allergies: ["Sulfa drugs", "Aspirin"],
  },
  {
    id: "q-0004",
    token_display: "MED-044",
    visit_id: "v-5004",
    patient_id: "p-1004",
    full_name: "Meena Patel",
    uhid: "UH1004",
    age_years: 45,
    sex: "female",
    status: "skipped",
    priority: "normal",
    wait_minutes: 25,
    last_visit_date: "2026-03-22",
    previous_diagnoses: ["Iron deficiency anaemia"],
    known_allergies: [],
  },
  {
    id: "q-0005",
    token_display: "MED-045",
    visit_id: "v-5005",
    patient_id: "p-1005",
    full_name: "Vikram Malhotra",
    uhid: "UH1005",
    age_years: 52,
    sex: "male",
    status: "waiting",
    priority: "emergency",
    wait_minutes: 2,
    last_visit_date: "2026-01-30",
    previous_diagnoses: ["Unstable angina — prior episode"],
    known_allergies: ["Warfarin"],
  },
  {
    id: "q-0006",
    token_display: "MED-046",
    visit_id: "v-5006",
    patient_id: "p-1006",
    full_name: "Pooja Sharma",
    uhid: "UH1006",
    age_years: 39,
    sex: "female",
    status: "recalled",
    priority: "doctor_recall",
    wait_minutes: 6,
    last_visit_date: "2026-07-01",
    previous_diagnoses: ["Recall: lab report review"],
    known_allergies: [],
  },
  {
    id: "q-0007",
    token_display: "MED-047",
    visit_id: "v-5007",
    patient_id: "p-1007",
    full_name: "Suresh Nair",
    uhid: "UH1007",
    age_years: 61,
    sex: "male",
    status: "completed",
    priority: "normal",
    wait_minutes: 0,
    completed_at: new Date().toISOString(),
    last_visit_date: "2026-07-10",
    previous_diagnoses: ["Osteoarthritis of knee"],
    known_allergies: [],
  },
];

// --- Encounter context (resolved from a queue token) -----------------------

export function encounterContextFor(patient: QueuePatient): EncounterContext {
  return {
    visit_id: patient.visit_id,
    patient_id: patient.patient_id,
    patient_name: patient.full_name,
    uhid: patient.uhid,
    age_years: patient.age_years,
    sex: patient.sex,
    provider_user_id: MOCK_PROVIDER_USER_ID,
    provider_name: MOCK_PROVIDER_NAME,
    department: MOCK_DEPARTMENT,
    token_display: patient.token_display,
    known_allergies: patient.known_allergies ?? [],
  };
}

/** Default context for the standalone consultation route (first in-service patient). */
export const mockEncounterContext: EncounterContext = encounterContextFor(
  mockDoctorQueue.find((p) => p.status === "in_service") ?? mockDoctorQueue[0],
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

// --- Order catalogues (lab_order_items / radiology_order_items / procedures) -

export const mockLabTests: CatalogItem[] = [
  { id: "lt1", name: "Complete Blood Count (CBC)", code: "CBC" },
  { id: "lt2", name: "Fasting Blood Sugar", code: "FBS" },
  { id: "lt3", name: "Liver Function Test", code: "LFT" },
  { id: "lt4", name: "Kidney Function Test", code: "KFT" },
  { id: "lt5", name: "Thyroid Profile (T3, T4, TSH)", code: "TFT" },
  { id: "lt6", name: "HbA1c", code: "HBA1C" },
];

export const mockRadiologyTests: CatalogItem[] = [
  { id: "rt1", name: "Chest X-Ray (PA view)", code: "CXR-PA" },
  { id: "rt2", name: "Ultrasound — Abdomen", code: "USG-ABD" },
  { id: "rt3", name: "CT — Head (plain)", code: "CT-HEAD" },
  { id: "rt4", name: "MRI — Lumbar spine", code: "MRI-LS" },
];

export const mockProcedures: CatalogItem[] = [
  { id: "pr1", name: "Wound Dressing", code: "WND-DRESS" },
  { id: "pr2", name: "IV Cannulation", code: "IV-CANN" },
  { id: "pr3", name: "Nebulization", code: "NEBUL" },
  { id: "pr4", name: "Suturing (minor)", code: "SUTURE-MIN" },
];

// --- Medicines (inventory_items subset) ------------------------------------

export const mockMedicines: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", generic_name: "Paracetamol", strength: "500 mg", form: "tablet", is_controlled_drug: false },
  { id: "m2", name: "Amoxicillin 500mg", generic_name: "Amoxicillin", strength: "500 mg", form: "capsule", is_controlled_drug: false },
  { id: "m3", name: "Azithromycin 250mg", generic_name: "Azithromycin", strength: "250 mg", form: "tablet", is_controlled_drug: false },
  { id: "m4", name: "Metformin 500mg", generic_name: "Metformin", strength: "500 mg", form: "tablet", is_controlled_drug: false },
  { id: "m5", name: "Amlodipine 5mg", generic_name: "Amlodipine", strength: "5 mg", form: "tablet", is_controlled_drug: false },
  { id: "m6", name: "Aspirin 75mg", generic_name: "Aspirin", strength: "75 mg", form: "tablet", is_controlled_drug: false },
  { id: "m7", name: "Warfarin 5mg", generic_name: "Warfarin", strength: "5 mg", form: "tablet", is_controlled_drug: false },
  { id: "m8", name: "Ibuprofen 400mg", generic_name: "Ibuprofen", strength: "400 mg", form: "tablet", is_controlled_drug: false },
  { id: "m9", name: "Salbutamol Inhaler", generic_name: "Salbutamol", strength: "100 mcg/dose", form: "consumable", is_controlled_drug: false },
  { id: "m10", name: "Tramadol 50mg", generic_name: "Tramadol", strength: "50 mg", form: "capsule", is_controlled_drug: true },
  { id: "m11", name: "Ceftriaxone 1g Injection", generic_name: "Ceftriaxone", strength: "1 g", form: "injection", is_controlled_drug: false },
  { id: "m12", name: "Omeprazole 20mg", generic_name: "Omeprazole", strength: "20 mg", form: "capsule", is_controlled_drug: false },
];

/**
 * Mock drug-interaction rules by generic name (no schema table yet).
 * Each rule: two generics that interact + a message + severity.
 */
export const mockInteractionRules: {
  a: string;
  b: string;
  severity: "warning" | "critical";
  message: string;
}[] = [
  { a: "Warfarin", b: "Aspirin", severity: "critical", message: "Increased bleeding risk — avoid combining or monitor INR closely." },
  { a: "Warfarin", b: "Ibuprofen", severity: "critical", message: "NSAID + anticoagulant: high GI-bleed risk." },
  { a: "Aspirin", b: "Ibuprofen", severity: "warning", message: "Ibuprofen can blunt the antiplatelet effect of aspirin." },
  { a: "Tramadol", b: "Amitriptyline", severity: "warning", message: "Additive serotonergic effect — seizure/serotonin-syndrome risk." },
];

/**
 * Allergen → medicine generic/class matches (no schema table yet).
 * Maps a patient allergy string to the generics it should flag.
 */
export const mockAllergyMap: { allergen: string; matches: string[] }[] = [
  { allergen: "Penicillin", matches: ["Amoxicillin", "Ampicillin", "Ceftriaxone"] },
  { allergen: "Sulfa drugs", matches: ["Sulfamethoxazole", "Furosemide"] },
  { allergen: "Aspirin", matches: ["Aspirin", "Ibuprofen"] },
  { allergen: "Warfarin", matches: ["Warfarin"] },
];
