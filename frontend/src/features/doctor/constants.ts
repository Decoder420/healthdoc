import type {
  DiagnosisType,
  EncounterType,
  FrequencyCode,
  OrderPriority,
  OrderType,
  Modality,
  ProcedureSetting,
  RouteCode,
  SampleType,
  QueuePriority,
} from "./types";

/** Print header fallback until the facility profile endpoint supplies branding. */
export const FACILITY_DISPLAY_NAME =
  process.env.NEXT_PUBLIC_FACILITY_NAME ?? "HealthDoc Hospital";

/**
 * break_glass_grants.justification — the schema annotates it "≥20 chars,
 * mandatory", but as a comment, not a CHECK constraint. Enforced here so the
 * form matches intent; the server must enforce it too (raised with B7).
 */
export const BREAK_GLASS_JUSTIFICATION_MIN = 20;

/**
 * Minimum characters to override a non-anaphylaxis allergy.
 * Mirrors backend allergies/service.OVERRIDE_REASON_MIN_CHARS.
 * Anaphylaxis has no override at any length.
 */
export const ALLERGY_OVERRIDE_REASON_MIN = 20;

/** Schema priority sort (high → low) — QueuePriority docstring in enums.py. */
export const QUEUE_PRIORITY_RANK: Record<QueuePriority, number> = {
  emergency: 0,
  doctor_recall: 1,
  admin_override: 2,
  senior_citizen: 3,
  pregnant: 4,
  follow_up_recall: 5,
  normal: 6,
};

export const ENCOUNTER_TYPE_OPTIONS: { value: EncounterType; label: string }[] = [
  { value: "consultation", label: "Consultation" },
  { value: "follow_up", label: "Follow-up" },
  { value: "emergency", label: "Emergency" },
  { value: "ward_round", label: "Ward round" },
];

export const DIAGNOSIS_TYPE_OPTIONS: { value: DiagnosisType; label: string }[] = [
  { value: "provisional", label: "Provisional" },
  { value: "final", label: "Final" },
  { value: "differential", label: "Differential" },
];

export const ORDER_TYPE_OPTIONS: { value: OrderType; label: string }[] = [
  { value: "lab", label: "Lab" },
  { value: "radiology", label: "Radiology" },
  { value: "procedure", label: "Procedure" },
];

/** lab_order_items.sample_type — NOT NULL, so the form must collect it. */
export const SAMPLE_TYPE_OPTIONS: { value: SampleType; label: string }[] = [
  { value: "blood", label: "Blood" },
  { value: "serum", label: "Serum" },
  { value: "plasma", label: "Plasma" },
  { value: "urine", label: "Urine" },
  { value: "stool", label: "Stool" },
  { value: "swab", label: "Swab" },
  { value: "tissue", label: "Tissue" },
];

/** radiology_order_items.modality — NOT NULL. */
export const MODALITY_OPTIONS: { value: Modality; label: string }[] = [
  { value: "xray", label: "X-Ray" },
  { value: "ct", label: "CT" },
  { value: "mri", label: "MRI" },
  { value: "usg", label: "Ultrasound" },
  { value: "mammo", label: "Mammography" },
];

/** Non-theatre procedures. OT procedures require scheduling context first. */
export const PROCEDURE_SETTING_OPTIONS: { value: ProcedureSetting; label: string }[] = [
  { value: "opd_minor", label: "Minor OPD" },
  { value: "bedside", label: "Bedside" },
  { value: "emergency", label: "Emergency" },
];

export const ORDER_PRIORITY_OPTIONS: { value: OrderPriority; label: string }[] = [
  { value: "routine", label: "Routine" },
  { value: "urgent", label: "Urgent" },
  { value: "stat", label: "STAT" },
];

export const PRIORITY_META: Record<
  QueuePriority,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" } | null
> = {
  normal: null,
  senior_citizen: { label: "Senior", variant: "secondary" },
  pregnant: { label: "Pregnant", variant: "secondary" },
  emergency: { label: "Emergency", variant: "destructive" },
  doctor_recall: { label: "Recall", variant: "outline" },
  follow_up_recall: { label: "Follow-up", variant: "outline" },
  admin_override: { label: "Priority", variant: "outline" },
};

// --- Prescription vocabularies (prescription_items) ---

/** Frequency codes with expansions. SOS = as needed (PRN); STAT = immediately, once. */
export const FREQUENCY_OPTIONS: { value: FrequencyCode; label: string }[] = [
  { value: "OD", label: "OD — once daily" },
  { value: "BD", label: "BD — twice daily" },
  { value: "TDS", label: "TDS — thrice daily" },
  { value: "QID", label: "QID — four times daily" },
  { value: "HS", label: "HS — at bedtime" },
  { value: "STAT", label: "STAT — immediately, once" },
  { value: "SOS", label: "SOS — as needed (PRN)" },
];

/** Frequencies that don't take a fixed duration (single or as-needed dosing). */
export const FREQUENCIES_WITHOUT_DURATION: FrequencyCode[] = ["SOS", "STAT"];

export const ROUTE_OPTIONS: { value: RouteCode; label: string }[] = [
  { value: "oral", label: "Oral" },
  { value: "iv", label: "Intravenous (IV)" },
  { value: "im", label: "Intramuscular (IM)" },
  { value: "sc", label: "Subcutaneous (SC)" },
  { value: "topical", label: "Topical" },
  { value: "inhaled", label: "Inhaled" },
  { value: "sublingual", label: "Sublingual" },
  { value: "rectal", label: "Rectal" },
  { value: "ophthalmic", label: "Ophthalmic" },
];
