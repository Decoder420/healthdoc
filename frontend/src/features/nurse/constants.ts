import type { Shift } from "./types";

export const SHIFTS: readonly Shift[] = ["morning", "evening", "night"] as const;

export const INCIDENT_STATUS_LABELS: Record<string, string> = {
  reported: "Reported",
  under_review: "Under review",
  action_taken: "Action taken",
  closed: "Closed",
};
