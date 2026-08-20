"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { StatusChip } from "@/components/ui/StatusChip";
import { meridian } from "@/styles/theme";
import { doctorPanelSx } from "../panelSx";
import type { NoteStatus } from "../types";

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const BOXES: { key: keyof SoapNote; label: string; hint: string }[] = [
  { key: "subjective", label: "Subjective", hint: "What the patient reports — history, symptoms, in their words" },
  { key: "objective", label: "Objective", hint: "What you observed — examination findings, measurements" },
  { key: "assessment", label: "Assessment", hint: "Your clinical impression" },
  { key: "plan", label: "Plan", hint: "Management, investigations, follow-up" },
];

export interface SoapNotePanelProps {
  value: SoapNote;
  noteStatus: NoteStatus;
  onChange: (patch: Partial<SoapNote>) => void;
}

/**
 * The SOAP note. Saved on PATCH /encounters/{id} — never on the POST, which
 * does not accept these fields.
 *
 * note_status is shown, not hidden: `failed` means the long-form note did not
 * reach its store, and a note that silently vanished is far worse than one the
 * clinician knows to re-enter.
 */
export function SoapNotePanel({ value, noteStatus, onChange }: SoapNotePanelProps) {
  return (
    <Box sx={{ ...doctorPanelSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}
      >
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Clinical note</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            Subjective · Objective · Assessment · Plan
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.75rem", color: meridian.textSecondary }}>Note</Typography>
          <StatusChip
            status={noteStatus}
            label={
              noteStatus === "stored" ? "Stored" : noteStatus === "failed" ? "Not stored" : "Pending"
            }
          />
        </Stack>
      </Stack>

      {noteStatus === "failed" && (
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            border: "1px solid rgb(185 28 28 / 0.22)",
          }}
        >
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary }}>
            <strong>This note was not saved.</strong> Do not navigate away — save again, and keep a
            copy of anything clinically important.
          </Typography>
        </Box>
      )}

      <Stack spacing={2}>
        {BOXES.map((b) => (
          <TextField
            key={b.key}
            label={b.label}
            helperText={b.hint}
            value={value[b.key]}
            onChange={(e) => onChange({ [b.key]: e.target.value })}
            multiline
            minRows={2}
            fullWidth
          />
        ))}
      </Stack>
    </Box>
  );
}
