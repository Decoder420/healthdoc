import type { AccessChannel, ConsentStatus } from "./types";

export const FACILITY_ID = "fac-0001";

export const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
  active: "Active",
  expired: "Expired",
  revoked: "Revoked",
  pending: "Pending",
};

export const ACCESS_CHANNEL_LABELS: Record<AccessChannel, string> = {
  ui: "UI",
  api: "API",
  abdm_hiu: "ABDM HIU",
  export: "Export",
};

export const PURPOSE_LABELS: Record<string, string> = {
  TREATMENT: "Treatment",
  CARE_MANAGEMENT: "Care management",
  PUBLIC_HEALTH: "Public health",
  RESEARCH: "Research",
  PAYMENT: "Payment / billing",
};
