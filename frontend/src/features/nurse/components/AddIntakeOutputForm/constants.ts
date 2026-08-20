export const ENTRY_TYPES = [
  { label: "Oral Intake", value: "intake_oral" },
  { label: "IV Intake (includes blood/fluids given via IV)", value: "intake_iv" },
  { label: "Urine Output", value: "output_urine" },
  { label: "Drain Output (includes tube/vomit-type drainage)", value: "output_drain" },
  { label: "Other Output (e.g. stool)", value: "output_other" },
] as const;

export const DEFAULT_VALUES = {
  admission_id: "",
  entry_type: "intake_oral",
  recorded_at: "",
  volume_ml: undefined,
  notes: "",
} as const;