/**
 * Doctor module — entity + input types. Field names follow schema v3.5 §3
 * (encounters, diagnoses, orders, vitals, prescriptions, prescription_items,
 * queue_tokens, inventory_items). snake_case matches the API contract.
 */

// ---------------------------------------------------------------------------
// Queue (queue_tokens + joined patient columns)
// ---------------------------------------------------------------------------

/** queue_tokens.status — mirrors backend QueueTokenStatus (enums.py). */
export type QueueTokenStatus =
  | "waiting"
  | "called"
  | "in_service"
  | "skipped"
  | "no_show"
  | "recalled"
  | "transferred"
  | "completed"
  | "cancelled";

/** @deprecated Prefer QueueTokenStatus — alias kept for any external imports. */
export type VisitStatus = QueueTokenStatus;

/** queue_tokens.priority — mirrors backend QueuePriority (enums.py). */
export type QueuePriority =
  | "normal"
  | "senior_citizen"
  | "pregnant"
  | "emergency"
  | "doctor_recall"
  | "follow_up_recall"
  | "admin_override";

export interface QueuePatient {
  id: string;
  token_display: string;
  visit_id: string;
  patient_id: string;
  full_name: string;
  uhid: string;
  age_years: number;
  sex: "male" | "female" | "other";
  status: QueueTokenStatus;
  priority: QueuePriority;
  /** UI-derived from queue_tokens.created_at, not stored. */
  wait_minutes: number;
  /** queue_tokens.completed_at — drives "Completed Today" metric. */
  completed_at?: string;
  last_visit_date?: string;
  previous_diagnoses?: string[];
  /** Known allergies surfaced for prescribing safety (no schema table yet — mock). */
  known_allergies?: string[];
}

// ---------------------------------------------------------------------------
// Encounter (encounters)
// ---------------------------------------------------------------------------

export type EncounterType = "consultation" | "follow_up" | "emergency" | "ward_round";

export interface EncounterContext {
  visit_id: string;
  patient_id: string;
  patient_name: string;
  uhid: string;
  age_years: number;
  sex: string;
  provider_user_id: string;
  provider_name: string;
  department: string;
  token_display: string;
  known_allergies: string[];
}

export interface ActiveEncounter {
  encounter_id: string;
  visit_id: string;
  patient_id: string;
  provider_user_id: string;
  started_at: string;
  ended_at?: string;
}

/** POST /encounters body — only real encounters columns. */
export interface CreateEncounterInput {
  visit_id: string;
  provider_user_id: string;
  encounter_type: EncounterType;
  chief_complaint: string;
  started_at: string;
}

// ---------------------------------------------------------------------------
// Vitals (vitals — own table/endpoint)
// ---------------------------------------------------------------------------

export interface VitalsInput {
  patient_id: string;
  encounter_id: string;
  measured_at: string;
  temp_c?: number;
  pulse_bpm?: number;
  resp_rate?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  spo2_pct?: number;
  height_cm?: number;
  weight_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  pain_score?: number;
}

// ---------------------------------------------------------------------------
// Diagnoses (diagnoses + icd_codes catalog)
// ---------------------------------------------------------------------------

export type IcdVersion = "icd10" | "icd11";
export type DiagnosisType = "provisional" | "final" | "differential";

export interface IcdConcept {
  code: string;
  version: IcdVersion;
  title: string;
  icd_uri?: string;
  is_postcoordinable?: boolean;
}

export interface DraftDiagnosis {
  tempId: string;
  icd_code: string;
  icd_version: IcdVersion;
  icd_uri?: string;
  post_coordinated_code?: string;
  diagnosis_text: string;
  diagnosis_type: DiagnosisType;
  is_primary: boolean;
}

export interface CreateDiagnosisInput {
  encounter_id: string;
  icd_code: string;
  icd_version: IcdVersion;
  icd_uri?: string;
  post_coordinated_code?: string;
  diagnosis_text: string;
  diagnosis_type: DiagnosisType;
  is_primary: boolean;
}

// ---------------------------------------------------------------------------
// Orders (orders + department detail rows)
// ---------------------------------------------------------------------------

/** orders.order_type — mirrors backend OrderType. OPD doctor UI uses lab/radiology/procedure. */
export type OrderType = "lab" | "radiology" | "pharmacy" | "procedure" | "blood";
export type OrderPriority = "routine" | "urgent" | "stat";

export interface CatalogItem {
  id: string;
  name: string;
  code?: string;
}

export interface DraftOrder {
  tempId: string;
  order_type: OrderType;
  /** UI selection; the api resolves it to the detail row's test_code / scan_type. */
  catalog_item_id: string;
  /** maps to lab_order_items.test_name / radiology_order_items.scan_type. */
  item_name: string;
  priority: OrderPriority;
}

export interface CreateOrderInput {
  encounter_id: string;
  patient_id: string;
  order_type: OrderType;
  catalog_item_id: string;
  item_name: string;
  priority: OrderPriority;
}

// ---------------------------------------------------------------------------
// Prescriptions (prescriptions + prescription_items + inventory_items)
// ---------------------------------------------------------------------------

/** inventory_items.form — schema v3.5 §3. */
export type MedicineForm =
  | "tablet"
  | "capsule"
  | "injection"
  | "syrup"
  | "ointment"
  | "fluid"
  | "reagent"
  | "consumable"
  | "film"
  | "implant"
  | "blood_component";

/** Subset of inventory_items relevant to prescribing. */
export interface Medicine {
  id: string;
  name: string;
  generic_name?: string;
  strength?: string;
  form: MedicineForm;
  is_controlled_drug: boolean;
}

/** prescription_items.frequency — SOS = as-needed (PRN); STAT = immediately once. */
export type Frequency = "OD" | "BD" | "TDS" | "QID" | "HS" | "STAT" | "SOS";

/** prescription_items.route. */
export type PrescriptionRoute =
  | "oral"
  | "iv"
  | "im"
  | "sc"
  | "topical"
  | "inhaled"
  | "sublingual"
  | "rectal"
  | "ophthalmic";

export interface DraftPrescriptionItem {
  tempId: string;
  medicine_item_id?: string;
  medicine_name: string;
  generic_name?: string;
  strength?: string;
  form?: MedicineForm;
  is_controlled_drug: boolean;
  dosage: string;
  frequency: Frequency;
  duration_days?: number;
  route: PrescriptionRoute;
  instructions?: string;
}

/** One prescription_items row — only real columns (generic_name/strength/form
 *  live on inventory_items and are NOT sent; the server snapshots them). */
export interface PrescriptionItemInput {
  medicine_item_id?: string;
  medicine_name: string;
  dosage: string;
  frequency: Frequency;
  duration_days?: number;
  route: PrescriptionRoute;
  instructions?: string;
}

export interface CreatePrescriptionInput {
  encounter_id: string;
  patient_id: string;
  notes?: string;
  items: PrescriptionItemInput[];
}

// --- Prescribing safety (no schema table yet — mock-only warnings) ---

export type SafetySeverity = "info" | "warning" | "critical";

export interface AllergyWarning {
  kind: "allergy";
  severity: SafetySeverity;
  medicine_name: string;
  allergen: string;
  message: string;
}

export interface InteractionWarning {
  kind: "interaction";
  severity: SafetySeverity;
  pair: [string, string];
  message: string;
}

export type SafetyWarning = AllergyWarning | InteractionWarning;

export interface SafetyCheckResult {
  warnings: SafetyWarning[];
}
