// reportviewer/constants.ts

export const REPORT_STATUS = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  VERIFIED: "Verified",
  FINAL: "Final",
  CANCELLED: "Cancelled",
} as const;

export const REPORT_STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  VERIFIED: "bg-blue-100 text-blue-700",
  FINAL: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
} as const;

export const RESULT_FLAG_COLORS = {
  NORMAL: "text-green-600",
  HIGH: "text-red-600 font-semibold",
  LOW: "text-orange-600 font-semibold",
  CRITICAL: "text-red-800 font-bold",
  PANIC: "text-purple-700 font-bold",
} as const;

export const GENDER_LABELS = {
  Male: "Male",
  Female: "Female",
  Other: "Other",
} as const;

export const DATE_FORMAT = "dd MMM yyyy";

export const DATETIME_FORMAT = "dd MMM, hh:mm a";

export const DEFAULT_REPORT_TITLE = "Laboratory Investigation Report";

export const EMPTY_VALUE = "--";