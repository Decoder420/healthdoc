"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Badge } from "@/components/ui/Badge";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { meridian } from "@/styles/theme";
import { DIAGNOSIS_TYPE_OPTIONS } from "../constants";
import { useDiagnoses } from "../hooks/useDiagnoses";
import type { ActiveEncounter, DiagnosisType, IcdConcept } from "../types";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};
const btnSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px" } as const;

export interface DiagnosesPanelProps {
  encounter: ActiveEncounter;
}

export function DiagnosesPanel({ encounter }: DiagnosesPanelProps) {
  const { rows, options, search, addConcept, updateRow, setPrimary, removeRow, saving, save } =
    useDiagnoses(encounter);
  const [pick, setPick] = React.useState<IcdConcept | null>(null);

  const available = options.filter(
    (c) => !rows.some((r) => r.icd_code === c.code && r.icd_version === c.version),
  );

  return (
    <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Diagnoses</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            ICD-11 (ICD-10 accepted for continuity)
          </Typography>
        </Box>
        <Button variant="outlined" size="small" sx={btnSx} disabled={rows.length === 0 || saving} onClick={save}>
          {saving ? "Saving…" : "Save diagnoses"}
        </Button>
      </Stack>

      <SearchAutocomplete<IcdConcept>
        label="Search diagnosis"
        placeholder="e.g. hypertension, CA07, diabetes"
        options={available}
        value={pick}
        onChange={(c) => {
          if (c) addConcept(c);
          setPick(null);
        }}
        onInputChange={search}
        getOptionLabel={(c) => c.title}
        getOptionSubtext={(c) => `${c.version.toUpperCase()} · ${c.code}`}
        isOptionEqualToValue={(a, b) => a.code === b.code && a.version === b.version}
      />

      {rows.length === 0 ? (
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          No diagnoses added yet.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {rows.map((r) => (
            <Box
              key={r.tempId}
              sx={{
                p: 1.5,
                borderRadius: "12px",
                border: `1px solid ${meridian.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", gap: 1 }}>
                <Badge variant="outline">{`${r.icd_version.toUpperCase()} · ${r.icd_code}`}</Badge>
                {r.is_primary && <Badge variant="default">Primary</Badge>}
                <Box sx={{ flex: 1 }} />
                <IconButton size="small" onClick={() => removeRow(r.tempId)} aria-label="Remove diagnosis">
                  ×
                </IconButton>
              </Stack>

              <TextField
                label="Diagnosis text"
                value={r.diagnosis_text}
                onChange={(e) => updateRow(r.tempId, { diagnosis_text: e.target.value })}
                size="small"
                fullWidth
              />

              <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1.5 }}>
                <TextField
                  select
                  label="Type"
                  value={r.diagnosis_type}
                  onChange={(e) => updateRow(r.tempId, { diagnosis_type: e.target.value as DiagnosisType })}
                  size="small"
                  sx={{ minWidth: 160 }}
                >
                  {DIAGNOSIS_TYPE_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant={r.is_primary ? "contained" : "outlined"}
                  size="small"
                  sx={btnSx}
                  disabled={r.is_primary}
                  onClick={() => setPrimary(r.tempId)}
                >
                  {r.is_primary ? "Primary diagnosis" : "Set as primary"}
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
