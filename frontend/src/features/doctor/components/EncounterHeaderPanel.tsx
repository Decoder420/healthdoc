"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { ENCOUNTER_TYPE_OPTIONS } from "../constants";
import { formatAgeSex, formatTime } from "../lib/formatters";
import type { EncounterContext, EncounterType } from "../types";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: meridian.textSecondary,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, mt: 0.25 }}>{value}</Typography>
    </Box>
  );
}

export interface EncounterHeaderPanelProps {
  context: EncounterContext;
  startedAt: string;
  encounterType: EncounterType;
  onEncounterTypeChange: (value: EncounterType) => void;
}

export function EncounterHeaderPanel({
  context,
  startedAt,
  encounterType,
  onEncounterTypeChange,
}: EncounterHeaderPanelProps) {
  return (
    <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>{context.patient_name}</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            {formatAgeSex(context.age_years, context.sex)} · UHID {context.uhid} · Token {context.token_display}
          </Typography>
        </Box>
        <TextField
          select
          size="small"
          label="Encounter type"
          value={encounterType}
          onChange={(e) => onEncounterTypeChange(e.target.value as EncounterType)}
          sx={{ minWidth: 190 }}
        >
          {ENCOUNTER_TYPE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction="row" spacing={4} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Meta label="Provider" value={context.provider_name} />
        <Meta label="Department" value={context.department} />
        <Meta label="Visit ID" value={context.visit_id} />
        <Meta label="Started at" value={formatTime(startedAt)} />
      </Stack>
    </Box>
  );
}
