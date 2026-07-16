import * as React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";
import { meridian } from "@/styles/theme";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success";

export interface BadgeProps
  extends Omit<ChipProps, "color" | "variant" | "label" | "children"> {
  variant?: BadgeVariant;
  /** Accepts either `label="text"` (MUI style) or `<Badge>text</Badge>` (children) */
  children?: React.ReactNode;
  label?: React.ReactNode;
}

const VARIANT_SX: Record<BadgeVariant, object> = {
  default: {
    backgroundColor: meridian.brandPrimary,
    color: "#ffffff",
    border: `1px solid ${meridian.brandPrimary}`,
  },
  secondary: {
    backgroundColor: meridian.muted,
    color: meridian.textSecondary,
    border: `1px solid ${meridian.border}`,
  },
  destructive: {
    backgroundColor: "#fee2e2",
    color: meridian.danger,
    border: "1px solid rgb(185 28 28 / 0.18)",
  },
  outline: {
    backgroundColor: "transparent",
    color: meridian.textPrimary,
    border: `1px solid ${meridian.border}`,
  },
  success: {
    backgroundColor: "#dcfce7",
    color: meridian.success,
    border: "1px solid rgb(22 101 52 / 0.18)",
  },
};

/**
 * Generic labeling badge (counts, tags, small indicators) — e.g. "New",
 * "3 pending", "Critical". For clinical/visit STATUS specifically, use
 * <StatusChip /> instead — it already maps every status from the
 * architecture doc to a consistent color.
 */
export function Badge({
  variant = "default",
  size = "small",
  children,
  label,
  sx,
  ...props
}: BadgeProps) {
  return (
    <Chip
      size={size}
      label={label ?? children}
      sx={{
        height: size === "small" ? 24 : 28,
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: size === "small" ? "0.6875rem" : "0.75rem",
        letterSpacing: "0.02em",
        "& .MuiChip-label": {
          px: 1.1,
        },
        ...VARIANT_SX[variant],
        ...((sx as object) ?? {}),
      }}
      {...props}
    />
  );
}
