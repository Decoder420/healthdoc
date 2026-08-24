// FACILITY_ID re-exported MOCK_FACILITY_ID and had no consumers: consent is
// read per patient and scoped server-side through that patient, because
// consent_records has no facility_id of its own. Removed (P1.1).
import type { AccessChannel, ConsentChannel, ConsentStatus } from "./types";



export const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
  requested: "Requested",
  granted: "Granted",
  denied: "Denied",
  revoked: "Revoked",
  expired: "Expired",
};

export const CONSENT_CHANNEL_LABELS: Record<ConsentChannel, string> = {
  verbal: "Verbal",
  written: "Written",
  digital_otp: "Digital OTP",
  abdm_consent_manager: "ABDM consent manager",
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
