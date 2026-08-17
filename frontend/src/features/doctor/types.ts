/**
 * Doctor module — entity + input types. Field names follow schema v3.5 §3
 * (encounters, diagnoses, orders, vitals, prescriptions, prescription_items,
 * queue_tokens, inventory_items). snake_case matches the API contract.
 */

// ---------------------------------------------------------------------------
// Queue (queue_tokens + joined patient columns)
// ---------------------------------------------------------------------------

/** patients.sex — mirrors backend Sex (enums.py); `unknown` covers THID/emergency. */
export type Sex = "male" | "female" | "other" | "unknown";

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
  sex: Sex;
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
  /** encounters.id — §1 rule 1: every PK is `id`. */
  id: string;
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

// ---------------------------------------------------------------------------
// Results (lab_order_items + lab_results, radiology_order_items + radiology_reports)
// ---------------------------------------------------------------------------

/** lab_results.status / radiology_reports.status — backend ResultStatus. */
export type ResultStatus = "pending" | "preliminary" | "final" | "corrected";

/** radiology_order_items.modality — backend Modality. */
export type Modality = "xray" | "ct" | "mri" | "usg" | "mammo";

/**
 * PROVISIONAL — `lab_results.result_data` is declared only as `jsonb NOT NULL`
 * in schema v3.13 §3 0010; no inner shape is specified anywhere. This is our
 * proposed contract, pending B5 confirmation. Keep every assumption about the
 * payload in this file so a correction is a small diff.
 *
 * `flag` is supplied by the lab, never derived in the browser — reference
 * ranges vary by test, method, age and sex, and a wrong critical badge is a
 * patient-safety defect.
 */
export type AnalyteFlag = "normal" | "low" | "high" | "critical_low" | "critical_high";

export interface ResultAnalyte {
  /** LOINC where available, else the local test code. */
  code: string;
  name: string;
  /** String, not number — preserves significant digits and carries qualitative
   *  results ("Negative", "Trace") in the same field. */
  value: string;
  unit?: string;
  ref_low?: number;
  ref_high?: number;
  /** Non-numeric reference, e.g. "Negative" — used when ref_low/high are absent. */
  ref_text?: string;
  flag: AnalyteFlag;
}

export interface LabResultData {
  analytes: ResultAnalyte[];
}

/** One row of lab_results (append-only, versioned). */
export interface LabResult {
  id: string;
  lab_order_item_id: string;
  version: number;
  is_current: boolean;
  status: ResultStatus;
  result_data: LabResultData;
  remarks?: string;
  created_by: string;
  /** Joined display name for created_by — not a column. */
  created_by_name?: string;
  created_at: string;
}

/** One row of radiology_reports (append-only, versioned). */
export interface RadiologyReport {
  id: string;
  radiology_order_item_id: string;
  version: number;
  is_current: boolean;
  status: ResultStatus;
  findings: string;
  impression: string;
  pacs_study_uid?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
}

/**
 * PROVISIONAL — there is no table for doctor sign-off in schema v3.13. Columns
 * cannot simply be added to lab_results/radiology_reports because both are
 * append-only and versioned: a review would spawn a false result version.
 * Shape assumes a dedicated result_acknowledgements table (raised with B5/TL).
 */
export interface ResultAcknowledgement {
  id: string;
  lab_result_id?: string;
  radiology_report_id?: string;
  reviewed_by: string;
  reviewed_by_name?: string;
  reviewed_at: string;
  note?: string;
}

/**
 * A row in the doctor's results worklist — the order item joined with its
 * current result/report and patient context. Read shape, not a table.
 */
export interface ResultWorklistItem {
  /** lab_order_items.id or radiology_order_items.id. */
  id: string;
  order_id: string;
  order_number: string;
  order_type: "lab" | "radiology";
  accession_number: string;
  patient_id: string;
  patient_name: string;
  uhid: string;
  /** lab_order_items.test_name or radiology_order_items.scan_type. */
  test_name: string;
  /** radiology only. */
  modality?: Modality;
  priority: OrderPriority;
  /** The order item's own status (OrderStatus). */
  status: OrderStatus;
  /** Status of the current result/report, absent until one exists. */
  result_status?: ResultStatus;
  /** True when any analyte on the current result carries a critical flag. */
  has_critical: boolean;
  /** created_at of the current result/report. */
  reported_at?: string;
  acknowledged_at?: string;
}

export type OrderStatus = "placed" | "accepted" | "in_progress" | "completed" | "cancelled";

// ---------------------------------------------------------------------------
// Break-glass (break_glass_grants + data_access_log.emergency_access)
// ---------------------------------------------------------------------------

/** One row of break_glass_grants — schema v3.13 §3 0004. Real columns. */
export interface BreakGlassGrant {
  id: string;
  patient_id: string;
  granted_to_user_id: string;
  justification: string;
  granted_at: string;
  /**
   * Server-computed: granted_at + the facility's TTL (default 2h). The UI must
   * only ever *render* this value and never compute a deadline of its own — a
   * browser-side timer restarts on refresh, which would silently hand the
   * clinician more than the granted window.
   */
  expires_at: string;
  revoked_at?: string;
  revoked_by?: string;
  /** Set by the HOD/DPO review, not by this UI. Read-only here. */
  reviewed_at?: string;
  reviewed_by?: string;
  review_outcome?: string;
}

/**
 * POST body. The server owns granted_to_user_id (from the JWT), granted_at and
 * expires_at — none of the three is client-supplied.
 */
export interface CreateBreakGlassGrantInput {
  patient_id: string;
  justification: string;
}

/**
 * PROVISIONAL — why a clinical read was refused.
 *
 * In production this is the body of the 403 from the read itself. Schema v3.13
 * §4.4 documents no /consent endpoints and no error shape for a consent
 * refusal, so the UI currently has no way to learn that break-glass is the
 * remedy. This stands in for that contract (raised with B7/TL).
 */
export type RecordAccessBlockedReason = "consent_absent" | "consent_expired" | "consent_revoked";

export interface RecordAccess {
  patient_id: string;
  allowed: boolean;
  /** Present only when allowed is false. */
  blocked_reason?: RecordAccessBlockedReason;
  /** The caller's own active grant, when one is open. Access is then via break-glass. */
  grant?: BreakGlassGrant;
}

/**
 * PROVISIONAL — step-up MFA result.
 *
 * The schema gates break-glass on an MFA session (`amr` contains `otp`) but
 * never says whether the UI collects a TOTP code inline or bounces through
 * Keycloak for re-authentication. This is the inline shape; switching to a
 * redirect is a change to `verifyStepUp` and the modal's second step only.
 */
export interface StepUpResult {
  verified: boolean;
  error?: string;
}
