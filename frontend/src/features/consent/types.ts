/** Consent + data_access_log DTOs aligned to migration 0004. */

export type ConsentStatus = "active" | "expired" | "revoked" | "pending";

export type AccessChannel = "ui" | "api" | "abdm_hiu" | "export";

export type ConsentRecord = {
  id: string;
  patient_id: string;
  facility_id: string;
  purpose_code: string;
  status: ConsentStatus;
  valid_from: string;
  valid_to: string | null;
  granted_at: string;
  revoked_at: string | null;
  patient?: { uhid: string; name: string };
  purpose_label?: string;
};

export type DataAccessLog = {
  id: string;
  accessed_at: string;
  consent_id: string | null;
  user_id: string;
  role: string | null;
  resource_type: string;
  resource_id: string | null;
  patient_id: string | null;
  purpose_code: string | null;
  access_channel: AccessChannel;
  emergency_access: boolean;
  consent_required: boolean;
  consent_verified: boolean;
  user_display?: string;
};

export type ConsentListFilters = {
  query?: string;
  status?: ConsentStatus | "all";
};

export type DataAccessFilters = {
  consent_id?: string;
  patient_id?: string;
  query?: string;
};
