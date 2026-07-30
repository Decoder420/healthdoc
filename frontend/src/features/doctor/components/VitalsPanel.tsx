"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { useVitals, type VitalsForm } from "../hooks/useVitals";
import type { ActiveEncounter } from "../types";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};

const btnSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px" } as const;
const gridSx = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 } as const;

export interface VitalsPanelProps {
  encounter: ActiveEncounter;
}

export function VitalsPanel({ encounter }: VitalsPanelProps) {
  const { form, setField, bmi, whr, anyEntered, saving, record } = useVitals(encounter);

  const field = (label: string, key: keyof VitalsForm, unit?: string) => (
    <TextField
      label={label}
      value={form[key]}
      onChange={(e) => setField(key, e.target.value)}
      size="small"
      type="number"
      slotProps={
        unit ? { input: { endAdornment: <InputAdornment position="end">{unit}</InputAdornment> } } : undefined
      }
    />
  );

  return (
    <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Vitals</Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
            NABH structured capture — recorded as a measurement set
          </Typography>
        </Box>
        <Button variant="outlined" size="small" sx={btnSx} disabled={!anyEntered || saving} onClick={record}>
          {saving ? "Recording…" : "Record vitals"}
        </Button>
      </Stack>

      <Box sx={gridSx}>
        {field("Temperature", "temp_c", "°C")}
        {field("Pulse", "pulse_bpm", "bpm")}
        {field("Resp. rate", "resp_rate", "/min")}
        {field("SpO₂", "spo2_pct", "%")}
        {field("BP systolic", "bp_systolic", "mmHg")}
        {field("BP diastolic", "bp_diastolic", "mmHg")}
        {field("Pain score", "pain_score", "/10")}
      </Box>

      <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: meridian.textSecondary, mt: 0.5 }}>
        Anthropometry
      </Typography>
      <Box sx={gridSx}>
        {field("Height", "height_cm", "cm")}
        {field("Weight", "weight_kg", "kg")}
        {field("Waist", "waist_cm", "cm")}
        {field("Hip", "hip_cm", "cm")}
      </Box>

      <Stack direction="row" spacing={3} sx={{ mt: 0.5 }}>
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          BMI (auto): <strong>{bmi ?? "—"}</strong>
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
          WHR (auto): <strong>{whr ?? "—"}</strong>
        </Typography>
      </Stack>
    </Box>
  );
}
