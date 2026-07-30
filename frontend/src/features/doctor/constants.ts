import type {
  DiagnosisType,
  EncounterType,
  Frequency,
  OrderPriority,
  OrderType,
  PrescriptionRoute,
  QueuePriority,
} from "./types";

/** Mock provider / facility identity until Keycloak/session wiring lands. */
export const MOCK_PROVIDER_USER_ID = "00000000-0000-4000-8000-000000000201";
export const MOCK_PROVIDER_NAME = "Dr. A. Sharma";
export const MOCK_DEPARTMENT = "General Medicine";
export const MOCK_FACILITY_NAME = "HealthDoc Hospital";

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
export const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "OD", label: "OD — once daily" },
  { value: "BD", label: "BD — twice daily" },
  { value: "TDS", label: "TDS — thrice daily" },
  { value: "QID", label: "QID — four times daily" },
  { value: "HS", label: "HS — at bedtime" },
  { value: "STAT", label: "STAT — immediately, once" },
  { value: "SOS", label: "SOS — as needed (PRN)" },
];

/** Frequencies that don't take a fixed duration (single or as-needed dosing). */
export const FREQUENCIES_WITHOUT_DURATION: Frequency[] = ["SOS", "STAT"];

export const ROUTE_OPTIONS: { value: PrescriptionRoute; label: string }[] = [
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
