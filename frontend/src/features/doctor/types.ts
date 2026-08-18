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

/**
 * One queue_tokens row plus the patient columns the list endpoint joins for
 * display. Clinical facts (allergies, past diagnoses) are deliberately NOT here
 * — they hang off the patient, not off a token, and are fetched separately.
 */
export interface QueueToken {
  id: string;
  token_display: string;
  visit_id: string;
  patient_id: string;
  status: QueueTokenStatus;
  priority: QueuePriority;
  created_at: string;
  called_at?: string;
  completed_at?: string;
  // --- joined for the list row only ---
  full_name: string;
  uhid: string;
  age_years: number;
  sex: Sex;
}

// ---------------------------------------------------------------------------
// Patient (patients + /patients/{id}/history)
// ---------------------------------------------------------------------------

export interface Patient {
  id: string;
  /** NULL while the patient is THID-only (emergency path). */
  uhid?: string;
  thid?: string;
  full_name: string;
  sex: Sex;
  age_years: number;
  mobile?: string;
  photo_file_id?: string;
}

/** A prior visit as returned by GET /patients/{id}/history. */
export interface PatientHistoryEntry {
  visit_id: string;
  visit_number: string;
  visit_date: string;
  department: string;
  diagnoses: string[];
}

// ---------------------------------------------------------------------------
// Allergies (allergies — schema 0032)
// ---------------------------------------------------------------------------

export type AllergenType = "drug" | "food" | "environmental" | "other";
/** `anaphylaxis` is separate from `severe`: it is a hard block, not a warning. */
export type AllergySeverity = "mild" | "moderate" | "severe" | "anaphylaxis";
/** Allergies are corrected, never deleted. */
export type AllergyStatus = "active" | "inactive" | "refuted" | "entered_in_error";

export interface Allergy {
  id: string;
  patient_id: string;
  allergen_type: AllergenType;
  /** Always populated, even when coded — the attendant's words are the record. */
  substance_text: string;
  /** THE matchable key. Absent means "unknown", never "clear". */
  ingredient_code?: string;
  inventory_item_id?: string;
  reaction?: string;
  severity: AllergySeverity;
  status: AllergyStatus;
  onset_date?: string;
  recorded_by: string;
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
}

/**
 * encounters.note_status — whether the long-form SOAP note reached its store.
 * `failed` must stay visible: a note that silently vanished is worse than none.
 */
export type NoteStatus = "pending" | "stored" | "failed";

/** Mirrors backend EncounterOut (app/encounters/schemas.py). */
export interface ActiveEncounter {
  id: string;
  visit_id: string;
  patient_id: string;
  provider_user_id: string;
  encounter_type?: EncounterType;
  chief_complaint?: string;
  started_at: string;
  ended_at?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  note_status: NoteStatus;
  row_version?: number;
}

/** POST /encounters — SOAP is NOT accepted here, only on the PATCH. */
export interface CreateEncounterInput {
  visit_id: string;
  provider_user_id: string;
  encounter_type: EncounterType;
  chief_complaint: string;
  started_at: string;
}

/** PATCH /encounters/{id} — mirrors backend EncounterUpdate. */
export interface UpdateEncounterInput {
  ended_at?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  note_status?: NoteStatus;
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

/** radiology_order_items.modality. */
export type Modality = "xray" | "ct" | "mri" | "usg" | "mammo";
/** lab_order_items.sample_type — NOT NULL on the table. */
export type SampleType = "blood" | "serum" | "plasma" | "urine" | "stool" | "swab" | "tissue";
/** procedures.setting — works with the OT module off. */
export type ProcedureSetting = "opd_minor" | "bedside" | "emergency" | "ot";

/**
 * The order header (orders) — the only row every order type shares. There is no
 * catalog table in the schema, so nothing here references a catalog id: the
 * department detail row carries the free-text name the clinician chose.
 */
export interface DraftOrder {
  tempId: string;
  order_type: OrderType;
  priority: OrderPriority;
  /** lab only — lab_order_items.test_name + sample_type (both required). */
  test_name?: string;
  sample_type?: SampleType;
  /** radiology only — radiology_order_items.modality + scan_type (both required). */
  modality?: Modality;
  scan_type?: string;
  /** procedure only — procedures.procedure_name + setting. */
  procedure_name?: string;
  setting?: ProcedureSetting;
}

export interface CreateOrderInput {
  encounter_id: string;
  patient_id: string;
  order_type: OrderType;
  priority: OrderPriority;
  test_name?: string;
  sample_type?: SampleType;
  modality?: Modality;
  scan_type?: string;
  procedure_name?: string;
  setting?: ProcedureSetting;
}

/** What the server returns after placing an order — the doctor needs the numbers. */
export interface PlacedOrder {
  id: string;
  order_number: string;
  order_type: OrderType;
  priority: OrderPriority;
  status: OrderStatus;
  ordered_at: string;
  /** LAB-… / RAD-… from the department detail row. */
  accession_number?: string;
  item_label: string;
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
  /** The key the allergy check matches on. Absent = check cannot run. */
  ingredient_code?: string;
  strength?: string;
  form: MedicineForm;
  is_controlled_drug: boolean;
}

/** prescription_items.frequency — SOS = as-needed (PRN); STAT = immediately once. */
export type FrequencyCode = "OD" | "BD" | "TDS" | "QID" | "HS" | "STAT" | "SOS";

/** prescription_items.route is varchar too — same story as frequency. */
export type RouteCode =
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
  /** Carried for the allergy check; not a prescription_items column. */
  ingredient_code?: string;
  generic_name?: string;
  strength?: string;
  form?: MedicineForm;
  is_controlled_drug: boolean;
  dosage: string;
  /** varchar — a code from FREQUENCY_OPTIONS, or free text. */
  frequency: string;
  duration_days?: number;
  /** varchar — a code from ROUTE_OPTIONS, or free text. */
  route: string;
  instructions?: string;
}

/** One prescription_items row — only real columns (generic_name/strength/form
 *  live on inventory_items and are NOT sent; the server snapshots them). */
export interface PrescriptionItemInput {
  medicine_item_id?: string;
  medicine_name: string;
  dosage: string;
  /** varchar — a code from FREQUENCY_OPTIONS, or free text. */
  frequency: string;
  duration_days?: number;
  /** varchar — a code from ROUTE_OPTIONS, or free text. */
  route: string;
  instructions?: string;
}

export interface CreatePrescriptionInput {
  encounter_id: string;
  patient_id: string;
  notes?: string;
  items: PrescriptionItemInput[];
}

// --- Prescribing safety (allergies only) ---
//
// Drug-drug interaction checking is explicitly OUT OF SCOPE (schema v3.14:
// "ruled out of scope pending a licensed database"). We do not ship a homemade
// interaction table — a partial one is more dangerous than none, because it
// reads as authoritative.

/**
 * The three outcomes of checking one prescribed item against the patient's
 * active allergies. Mirrors backend allergies/service.check_prescription_item.
 */
export type AllergyAlertKind =
  /** Anaphylaxis: a hard block. No role, no reason, no override. */
  | "block"
  /** Matched a non-anaphylaxis allergy: needs a written reason to proceed. */
  | "override_required"
  /** The medicine has no ingredient_code, so the check could not run at all. */
  | "uncheckable";

export interface AllergyAlert {
  kind: AllergyAlertKind;
  medicine_name: string;
  /** The matched allergy row; absent when the check could not run. */
  allergy?: Allergy;
  message: string;
}

// ---------------------------------------------------------------------------
// Results (lab_order_items + lab_results, radiology_order_items + radiology_reports)
// ---------------------------------------------------------------------------

/** lab_results.status / radiology_reports.status — backend ResultStatus. */
export type ResultStatus = "pending" | "preliminary" | "final" | "corrected";

/**
 * `lab_results.result_data` is `jsonb NOT NULL` with NO inner shape specified by
 * the schema or the backend. We therefore do not define one: inventing an
 * analyte/range/flag format here would harden a guess into a contract, and a
 * wrongly-derived critical flag is a patient-safety defect. The viewer renders
 * whatever keys the lab actually sent.
 */
export type LabResultData = Record<string, unknown>;

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
 * doctor_reviews — the real sign-off record (backend app/encounters).
 * Created against the ENCOUNTER and pointed at a lab or radiology order item;
 * lab_results/radiology_reports stay append-only and untouched by a review.
 */
export type DoctorReviewStatus = "pending" | "reviewed" | "signed_off";

export interface DoctorReview {
  id: string;
  encounter_id: string;
  reviewed_by: string;
  /** Joined display name — not a column. */
  reviewed_by_name?: string;
  lab_order_item_id?: string;
  radiology_order_item_id?: string;
  status: DoctorReviewStatus;
  notes?: string;
  signed_off_at?: string;
  created_at: string;
  updated_at: string;
}

/** POST /encounters/{encounter_id}/reviews — mirrors DoctorReviewCreate. */
export interface CreateDoctorReviewInput {
  lab_order_item_id?: string;
  radiology_order_item_id?: string;
  notes?: string;
}

/** PATCH /encounters/reviews/{review_id} — mirrors DoctorReviewStatusUpdate. */
export interface UpdateDoctorReviewInput {
  status: Exclude<DoctorReviewStatus, "pending">;
  notes?: string;
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
  /** created_at of the current result/report. */
  reported_at?: string;
  /** Status of this item's doctor_reviews row, absent until a review is opened. */
  review_status?: DoctorReviewStatus;
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
