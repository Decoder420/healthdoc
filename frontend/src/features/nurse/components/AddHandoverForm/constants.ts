export const DEFAULT_VALUES = {
  admission_id: "",
  shift: "morning",
  situation: "",
  background: "",
  assessment: "",
  recommendation: "",
  handed_over_to: "",
} as const;

// Lowercase snake_case — must match the Shift enum values the backend expects.
export const SHIFTS = ["morning", "evening", "night"] as const;