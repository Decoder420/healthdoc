"use client";

import Chip, { ChipProps } from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";

import { StatusStep } from "./types";

interface StatusChipProps {
  status: string;
  workflow: StatusStep[];

  size?: ChipProps["size"];
  variant?: ChipProps["variant"];

  sx?: SxProps<Theme>;
}

const CHIP_STYLES = {
  primary: {
    bgcolor: "#F8FAFC",
    color: "#0F172A",
    border: "#CBD5E1",
  },

  info: {
    bgcolor: "#F8FAFC",
    color: "#334155",
    border: "#CBD5E1",
  },

  warning: {
    bgcolor: "#FFFBEB",
    color: "#92400E",
    border: "#FCD34D",
  },

  success: {
    bgcolor: "#F0FDF4",
    color: "#166534",
    border: "#BBF7D0",
  },

  error: {
    bgcolor: "#FEF2F2",
    color: "#B91C1C",
    border: "#FECACA",
  },

  secondary: {
    bgcolor: "#F8FAFC",
    color: "#475569",
    border: "#CBD5E1",
  },

  default: {
    bgcolor: "#F8FAFC",
    color: "#475569",
    border: "#CBD5E1",
  },
} as const;

export default function StatusChip({
  status,
  workflow,
  size = "small",
  variant = "filled",
  sx,
}: StatusChipProps) {
  const currentStatus = workflow.find(
    (step) => step.value === status
  );

  const palette =
    CHIP_STYLES[
      (currentStatus?.color ??
        "default") as keyof typeof CHIP_STYLES
    ] ?? CHIP_STYLES.default;

  const label =
    currentStatus?.label ??
    status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  return (
    <Chip
      label={label}
      size={size}
      variant={variant}
      sx={{
        height: 30,
        minWidth: 110,

        px: 0.5,

        bgcolor: palette.bgcolor,
        color: palette.color,
        border: `1px solid ${palette.border}`,

        borderRadius: 2,

        fontSize: "0.76rem",
        fontWeight: 600,
        letterSpacing: 0.2,

        boxShadow: "none",

        transition: "all .2s ease",

        "& .MuiChip-label": {
          px: 1.5,
          py: 0,
        },

        "&:hover": {
          bgcolor: palette.bgcolor,
        },

        ...sx,
      }}
    />
  );
}