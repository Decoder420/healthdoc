"use client";

import Chip, { type ChipProps } from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";

import { meridian } from "@/styles/theme";
import type { StatusStep } from "./types";

const COLOR_TONE: Record<
  NonNullable<ChipProps["color"]>,
  { bg: string; fg: string; border: string }
> = {
  default: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
  },
  primary: {
    bg: "#e8eef5",
    fg: meridian.brandPrimary,
    border: "rgb(0 31 84 / 0.18)",
  },
  secondary: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
  },
  error: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
  },
  info: {
    bg: "#e8eef5",
    fg: meridian.info,
    border: "rgb(0 31 84 / 0.14)",
  },
  success: {
    bg: "#dcfce7",
    fg: meridian.success,
    border: "rgb(22 101 52 / 0.18)",
  },
  warning: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
  },
};

interface StatusChipProps {
  status: string;
  workflow: StatusStep[];
  size?: ChipProps["size"];
  variant?: ChipProps["variant"];
  sx?: SxProps<Theme>;
}

export default function StatusChip({
  status,
  workflow,
  size = "small",
  sx,
}: StatusChipProps) {
  const currentStatus = workflow.find((step) => step.value === status);
  const tone = COLOR_TONE[currentStatus?.color ?? "default"] ?? COLOR_TONE.default;

  const label =
    currentStatus?.label ??
    status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        height: size === "small" ? 24 : 28,
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: size === "small" ? "0.6875rem" : "0.75rem",
        letterSpacing: "0.01em",
        minWidth: 110,
        backgroundColor: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        "& .MuiChip-label": { px: 1.25 },
        ...((sx as object) ?? {}),
      }}
    />
  );
}
