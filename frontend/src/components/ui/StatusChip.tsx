import * as React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";
import { meridian } from "@/styles/theme";

type StatusTone = {
  bg: string;
  fg: string;
  border: string;
  label?: string;
};

/**
 * Shared status tones. Queue tokens use QueueTokenStatus
 * (waiting|called|in_service|skipped|no_show|recalled|transferred|completed|cancelled).
 * Billing / audit / consent keys are also mapped for cross-module reuse.
 */
const STATUS_TONE_MAP: Record<string, StatusTone> = {
  waiting: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
  },
  called: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "Called",
  },
  in_service: {
    bg: "#e8eef5",
    fg: meridian.brandPrimary,
    border: "rgb(0 31 84 / 0.18)",
    label: "In Service",
  },
  skipped: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Skipped",
  },
  no_show: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
    label: "No Show",
  },
  transferred: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "Transferred",
  },
  completed: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
  },
  cancelled: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
  },
  draft: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
    label: "Draft",
  },
  issued: {
    bg: "#e8eef5",
    fg: meridian.brandPrimary,
    border: "rgb(0 31 84 / 0.18)",
    label: "Issued",
  },
  partially_paid: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Partially Paid",
  },
  paid: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "Paid",
  },
  waived: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "Waived",
  },
  recalled: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
  },
  // Audit / consent / verification (B7 viewers)
  verified: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "Verified",
  },
  failed: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
    label: "Failed",
  },
  pending: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Pending",
  },
  active: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "Active",
  },
  expired: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
    label: "Expired",
  },
  revoked: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
    label: "Revoked",
  },
  create: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "Create",
  },
  update: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "Update",
  },
  merge: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Merge",
  },
  login: {
    bg: "#e8eef5",
    fg: meridian.brandPrimary,
    border: "rgb(0 31 84 / 0.18)",
    label: "Login",
  },
  logout: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
    label: "Logout",
  },
  view: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "View",
  },
  export: {
    bg: "#e8eef5",
    fg: meridian.brandPrimary,
    border: "rgb(0 31 84 / 0.18)",
    label: "Export",
  },
  download: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "Download",
  },
  upload: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "Upload",
  },
  delete_attempt: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
    label: "Delete attempt",
  },
  emergency: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
    label: "Break-glass",
  },
  success: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
    label: "Success",
  },
  reversed: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
    label: "Reversed",
  },
};

const FALLBACK_TONE: StatusTone = {
  bg: meridian.muted,
  fg: meridian.textSecondary,
  border: meridian.border,
};

export interface StatusChipProps extends Omit<ChipProps, "color" | "label"> {
  /** e.g. "in_service", "skipped" — snake_case status key from the API */
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

export function StatusChip({
  status,
  label,
  size = "small",
  sx,
  ...props
}: StatusChipProps) {
  const normalized = status?.toLowerCase().replace(/\s+/g, "_") ?? "";
  const tone = STATUS_TONE_MAP[normalized] ?? FALLBACK_TONE;

  return (
    <Chip
      size={size}
      label={label ?? tone.label ?? toTitleCase(normalized || "unknown")}
      sx={{
        height: size === "small" ? 24 : 28,
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: size === "small" ? "0.6875rem" : "0.75rem",
        letterSpacing: "0.01em",
        backgroundColor: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        "& .MuiChip-label": {
          px: 1.25,
        },
        ...((sx as object) ?? {}),
      }}
      {...props}
    />
  );
}
