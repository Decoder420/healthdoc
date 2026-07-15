import * as React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success";

export interface BadgeProps extends Omit<ChipProps, "color" | "variant" | "label" | "children"> {
  variant?: BadgeVariant;
  /** Accepts either `label="text"` (MUI style) or `<Badge>text</Badge>` (children) */
  children?: React.ReactNode;
  label?: React.ReactNode;
}

const VARIANT_MAP: Record<BadgeVariant, Pick<ChipProps, "color" | "variant">> = {
  default: { color: "primary", variant: "filled" },
  secondary: { color: "default", variant: "filled" },
  destructive: { color: "error", variant: "filled" },
  outline: { color: "default", variant: "outlined" },
  success: { color: "success", variant: "filled" },
};

/**
 * Generic labeling badge (counts, tags, small indicators) — e.g. "New",
 * "3 pending", "Critical". For clinical/visit STATUS specifically, use
 * <StatusChip /> instead — it already maps every status from the
 * architecture doc to a consistent color.
 */
export function Badge({ variant = "default", size = "small", children, label, ...props }: BadgeProps) {
  const { color, variant: chipVariant } = VARIANT_MAP[variant];
  return <Chip size={size} color={color} variant={chipVariant} label={label ?? children} {...props} />;
}
