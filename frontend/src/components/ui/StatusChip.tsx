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
 * Every visit/order status that appears in the architecture doc
 * (section 13, "Status Values") is mapped here so the same status
 * always renders with the same color across every module —
 * doctor, lab, radiology, pharmacy, IPD, etc.
 *
 * If a new status is added to the backend, add it here too instead
 * of hardcoding a color at the call site.
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
  waiting_for_investigation: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Waiting for Investigation",
  },
  report_ready: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
    label: "Report Ready",
  },
  doctor_review_pending: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Doctor Review Pending",
  },
  pharmacy_pending: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
    label: "Pharmacy Pending",
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
  recalled: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
  },
};

const FALLBACK_TONE: StatusTone = {
  bg: meridian.muted,
  fg: meridian.textSecondary,
  border: meridian.border,
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
