"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import type { SoapNote } from "./SoapNotePanel";
import type { UpdateEncounterInput } from "../types";

const FIELDS: { key: keyof SoapNote; label: string }[] = [
  { key: "subjective", label: "Subjective" },
  { key: "objective", label: "Objective" },
  { key: "assessment", label: "Assessment" },
  { key: "plan", label: "Plan" },
];

export interface StaleWritePanelProps {
  yours: SoapNote;
  theirs: UpdateEncounterInput;
}

/**
 * Shown when a save is refused because someone else wrote first (409
 * stale_write). Both versions are displayed side by side and NOTHING is
 * overwritten — the clinician decides what survives. Silently keeping either
 * copy would destroy a colleague's clinical note.
 */
export function StaleWritePanel({ yours, theirs }: StaleWritePanelProps) {
  const changed = FIELDS.filter((f) => (yours[f.key] ?? "") !== (theirs[f.key] ?? ""));

  return (
    <Box
      sx={{
        px: 2,
        py: 1.75,
        borderRadius: "16px",
        backgroundColor: "#fee2e2",
        border: "1px solid rgb(185 28 28 / 0.22)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: meridian.danger,
          mb: 0.75,
        }}
      >
        Not saved — this encounter changed while you were editing
      </Typography>
      <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary, mb: 1.5 }}>
        Your note was <strong>not</strong> stored, and nothing of theirs was overwritten. Compare the
        two and re-enter what should stand.
      </Typography>

      {changed.length === 0 ? (
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          The text is identical — only the version differs. Reload and save again.
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {changed.map((f) => (
            <Box key={f.key}>
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: meridian.textSecondary,
                  mb: 0.5,
                }}
              >
                {f.label}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: meridian.surface,
                    border: `1px solid ${meridian.border}`,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6875rem", color: meridian.textSecondary }}>
                    Yours
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", whiteSpace: "pre-wrap" }}>
                    {yours[f.key] || "—"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: meridian.surface,
                    border: `1px solid ${meridian.border}`,
                  }}
                >
                  <Typography sx={{ fontSize: "0.6875rem", color: meridian.textSecondary }}>
                    On the server
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", whiteSpace: "pre-wrap" }}>
                    {theirs[f.key] || "—"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
