import type { AccessChannel, AuditAction, FileAccessAction, VerificationStatus } from "./types";
import {
  MOCK_FACILITY_CODE,
  MOCK_FACILITY_ID,
} from "@/lib/mock/facility";

export const FACILITY_ID = MOCK_FACILITY_ID;
export const FACILITY_CODE = MOCK_FACILITY_CODE;

export const AUDIT_ACTION_LABELS: Record<string, string> = {
  create: "Create",
  update: "Update",
  merge: "Merge",
  login: "Login",
  logout: "Logout",
  view: "View",
  export: "Export",
  delete_attempt: "Delete attempt",
};

export const FILE_ACCESS_ACTION_LABELS: Record<FileAccessAction, string> = {
  view: "View",
  download: "Download",
  upload: "Upload",
  delete_attempt: "Delete attempt",
};

export const ACCESS_CHANNEL_LABELS: Record<AccessChannel, string> = {
  ui: "UI",
  api: "API",
  abdm_hiu: "ABDM HIU",
  export: "Export",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  failed: "Failed",
};

export const COMMON_AUDIT_ACTIONS: AuditAction[] = [
  "create",
  "update",
  "merge",
  "login",
  "view",
  "export",
];

export const COMMON_RESOURCE_TYPES = [
  "patients",
  "visits",
  "invoices",
  "lab_orders",
  "radiology_orders",
  "users",
];
