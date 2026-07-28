"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};

export interface ChiefComplaintPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChiefComplaintPanel({ value, onChange }: ChiefComplaintPanelProps) {
  return (
    <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Chief complaint</Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
          Reason for today&apos;s visit, in the patient&apos;s words
        </Typography>
      </Box>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Fever and sore throat for 3 days"
        multiline
        minRows={2}
        fullWidth
      />
    </Box>
  );
}
