import * as React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";

/**
 * Every visit/order status that appears in the architecture doc
 * (section 13, "Status Values") is mapped here so the same status
 * always renders with the same color across every module —
 * doctor, lab, radiology, pharmacy, IPD, etc.
 *
 * If a new status is added to the backend, add it here too instead
 * of hardcoding a color at the call site.
 */
const STATUS_COLOR_MAP: Record<
  string,
  { color: ChipProps["color"]; label?: string }
> = {
  waiting: { color: "default" },
  called: { color: "info" },
  in_consultation: { color: "primary", label: "In Consultation" },
  waiting_for_investigation: {
    color: "warning",
    label: "Waiting for Investigation",
  },
  report_ready: { color: "info", label: "Report Ready" },
  doctor_review_pending: {
    color: "warning",
    label: "Doctor Review Pending",
  },
  pharmacy_pending: { color: "warning", label: "Pharmacy Pending" },
  completed: { color: "success" },
  cancelled: { color: "error" },
  recalled: { color: "secondary" },
};

export interface StatusChipProps extends Omit<ChipProps, "color" | "label"> {
  /** e.g. "in_consultation", "waiting_for_investigation" — snake_case status key from the API */
  status: string;
  /** Override the auto-generated label if the API sends a different display string */
  label?: string;
}

function toTitleCase(key: string) {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusChip({ status, label, size = "small", ...props }: StatusChipProps) {
  const normalized = status?.toLowerCase().replace(/\s+/g, "_") ?? "";
  const config = STATUS_COLOR_MAP[normalized] ?? { color: "default" };

  return (
    <Chip
      size={size}
      color={config.color}
      label={label ?? config.label ?? toTitleCase(normalized || "unknown")}
      variant="filled"
      {...props}
    />
  );
}
