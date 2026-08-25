"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { meridian } from "@/styles/theme";
import { DIAGNOSIS_TYPE_OPTIONS } from "../constants";
import { useDiagnoses } from "../hooks/useDiagnoses";
import { doctorPanelSx, doctorButtonSx } from "../panelSx";
import type { ActiveEncounter, DiagnosisType, IcdConcept } from "../types";

export interface DiagnosesPanelProps {
  encounter: ActiveEncounter;
}

export function DiagnosesPanel({ encounter }: DiagnosesPanelProps) {
  const { rows, options, loading, search, addConcept, updateRow, setPrimary, removeRow, saving, save } =
    useDiagnoses(encounter);
  const [pick, setPick] = React.useState<IcdConcept | null>(null);
  const pendingCount = rows.filter((row) => !row.persisted).length;
  const persistedPrimary = rows.some((row) => row.persisted && row.is_primary);

  const available = options.filter(
    (c) => !rows.some((r) => r.icd_code === c.code && r.icd_version === c.version),
  );

  return (
    <Box sx={{ ...doctorPanelSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Diagnoses</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            ICD-11 (ICD-10 accepted for continuity)
          </Typography>
        </Box>
        <Button variant="outlined" size="small" sx={doctorButtonSx} disabled={pendingCount === 0 || loading || saving} onClick={save}>
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

      {loading ? (
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          Loading diagnoses…
        </Typography>
      ) : rows.length === 0 ? (
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
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                <Badge variant="outline">{`${r.icd_version.toUpperCase()} · ${r.icd_code}`}</Badge>
                {r.is_primary && <Badge variant="default">Primary</Badge>}
                {r.persisted && <Badge variant="secondary">Saved</Badge>}
                <Box sx={{ flex: 1 }} />
                {!r.persisted && (
                  <IconButton size="small" onClick={() => removeRow(r.tempId)} aria-label="Remove diagnosis">
                    ×
                  </IconButton>
                )}
              </Stack>

              <TextField
                label="Diagnosis text"
                value={r.diagnosis_text}
                onChange={(e) => updateRow(r.tempId, { diagnosis_text: e.target.value })}
                disabled={r.persisted}
                size="small"
                fullWidth
              />

              <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1.5 }}>
                <TextField
                  select
                  label="Type"
                  value={r.diagnosis_type}
                  onChange={(e) => updateRow(r.tempId, { diagnosis_type: e.target.value as DiagnosisType })}
                  disabled={r.persisted}
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
                  sx={doctorButtonSx}
                  disabled={r.persisted || r.is_primary || persistedPrimary}
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
