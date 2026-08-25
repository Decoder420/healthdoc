export const SETTINGS = [
  { label: "OPD Minor Procedure", value: "opd_minor" },
  { label: "Bedside", value: "bedside" },
  { label: "Emergency", value: "emergency" },
  { label: "Operation Theatre", value: "ot" },
] as const;

export const DEFAULT_VALUES = {
  encounter_id: "",
  patient_id: "",
  procedure_name: "",
  procedure_code: "",
  code_system: "",
  setting: "bedside",
  ot_schedule_id: "",
  performed_by: "",
  assisted_by: "",
  started_at: "",
  ended_at: "",
  outcome: "",
  complications: "",
} as const;