"use client";

import Chip, { ChipProps } from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";
import { StatusStep } from "./types";

interface StatusChipProps {
  /** Current status value (e.g. "PROCESSING") */
  status: string;

  /** Workflow status definitions */
  workflow: StatusStep[];

  /** Optional MUI Chip props */
  size?: ChipProps["size"];
  variant?: ChipProps["variant"];

  /** Custom styling */
  sx?: SxProps<Theme>;
}

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

  return (
    <Chip
      label={
        currentStatus?.label ??
        status
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())
      }
      color={currentStatus?.color ?? "default"}
      size={size}
      variant={variant}
      sx={{
        borderRadius: "999px",
        fontWeight: 600,
        minWidth: 110,
        textTransform: "capitalize",
        ...sx,
      }}
    />
  );
}