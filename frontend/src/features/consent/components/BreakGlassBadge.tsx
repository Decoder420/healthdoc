"use client";

import Chip from "@mui/material/Chip";

import { meridian } from "@/styles/theme";

export function BreakGlassBadge() {
  return (
    <Chip
      size="small"
      label="Break-glass"
      sx={{
        height: 24,
        borderRadius: "999px",
        fontWeight: 700,
        fontSize: "0.6875rem",
        backgroundColor: "#fee2e2",
        color: meridian.danger,
        border: "1px solid rgb(185 28 28 / 0.18)",
      }}
    />
  );
}
