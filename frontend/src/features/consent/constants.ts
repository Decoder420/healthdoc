import type { AccessChannel, ConsentChannel, ConsentStatus } from "./types";

import { MOCK_FACILITY_ID } from "@/lib/mock/facility";

export const FACILITY_ID = MOCK_FACILITY_ID;

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
