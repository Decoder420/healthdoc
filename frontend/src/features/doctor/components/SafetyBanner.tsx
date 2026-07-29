"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import type { SafetySeverity, SafetyWarning } from "../types";

const TONE: Record<SafetySeverity, { bg: string; fg: string; border: string; label: string }> = {
  critical: { bg: "#fee2e2", fg: meridian.danger, border: "rgb(185 28 28 / 0.22)", label: "Critical" },
  warning: { bg: "#fef3c7", fg: meridian.warning, border: "rgb(180 83 9 / 0.22)", label: "Warning" },
  info: { bg: "#e8eef5", fg: meridian.info, border: "rgb(0 31 84 / 0.16)", label: "Info" },
};

export interface SafetyBannerProps {
  warnings: SafetyWarning[];
  checking?: boolean;
}

/** Allergy + drug-interaction alerts, most severe first. Mock CDS — no schema table yet. */
export function SafetyBanner({ warnings, checking }: SafetyBannerProps) {
  if (checking && warnings.length === 0) {
    return (
      <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary }}>
        Checking interactions and allergies…
      </Typography>
    );
  }
  if (warnings.length === 0) return null;

  const order: SafetySeverity[] = ["critical", "warning", "info"];
  const sorted = [...warnings].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));

  return (
    <Stack spacing={1}>
      {sorted.map((w, i) => {
        const tone = TONE[w.severity];
        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "baseline",
              px: 1.5,
              py: 1,
              borderRadius: "12px",
              backgroundColor: tone.bg,
              border: `1px solid ${tone.border}`,
            }}
          >
            <Typography sx={{ fontSize: "0.6875rem", fontWeight: 700, color: tone.fg, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {w.kind === "allergy" ? "Allergy" : "Interaction"} · {tone.label}
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary }}>{w.message}</Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
