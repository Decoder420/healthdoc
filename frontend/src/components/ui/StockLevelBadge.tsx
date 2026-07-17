"use client";

import Chip from "@mui/material/Chip";
import { meridian } from "@/styles/theme";

interface StockLevelBadgeProps {
  quantity: number;
  minimumQuantity: number;
}

export default function StockLevelBadge({
  quantity,
  minimumQuantity,
}: StockLevelBadgeProps) {
  let label = "In Stock";
  let bg: string = "#dcfce7";
  let fg: string = meridian.success;
  let border: string = "rgb(22 101 52 / 0.18)";

  if (quantity === 0) {
    label = "Out of Stock";
    bg = "#fee2e2";
    fg = meridian.danger;
    border = "rgb(185 28 28 / 0.18)";
  } else if (quantity <= minimumQuantity) {
    label = "Low Stock";
    bg = "#fef3c7";
    fg = meridian.warning;
    border = "rgb(180 83 9 / 0.2)";
  }

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        height: 24,
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: "0.6875rem",
        letterSpacing: "0.01em",
        backgroundColor: bg,
        color: fg,
        border: `1px solid ${border}`,
        fontFamily: 'var(--font-ibm-plex-mono), "IBM Plex Mono", monospace',
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}
