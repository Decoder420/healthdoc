"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { usePrescription } from "../hooks/usePrescription";
import { formatAgeSex } from "../lib/formatters";
import type { ActiveEncounter, EncounterContext } from "../types";
import { MedicineSearchModal } from "./MedicineSearchModal";
import { PrescriptionItemRow } from "./PrescriptionItemRow";
import { PrescriptionPrintView } from "./PrescriptionPrintView";
import { SafetyBanner } from "./SafetyBanner";

import "../prescription-print.css";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};
const btnSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px" } as const;

export interface PrescriptionWorkspaceProps {
  context: EncounterContext;
}

/** Week 4 — e-Prescription: search, dosage/frequency/route, SOS, safety banners, print. */
export function PrescriptionWorkspace({ context }: PrescriptionWorkspaceProps) {
  const [encounter] = React.useState<ActiveEncounter>(() => ({
    encounter_id: crypto.randomUUID(),
    visit_id: context.visit_id,
    patient_id: context.patient_id,
    provider_user_id: context.provider_user_id,
    started_at: new Date().toISOString(),
  }));

  const {
    items,
    notes,
    setNotes,
    warnings,
    checking,
    hasCritical,
    saving,
    addMedicine,
    updateItem,
    removeItem,
    save,
  } = usePrescription(encounter, context);

  const [pickOpen, setPickOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Prescription</Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
              {context.patient_name} · {formatAgeSex(context.age_years, context.sex)} · UHID {context.uhid} · Token{" "}
              {context.token_display}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" sx={btnSx} onClick={() => setPickOpen(true)}>
            + Add medicine
          </Button>
        </Stack>

        <SafetyBanner warnings={warnings} checking={checking} />

        {items.length === 0 ? (
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
            No medicines added yet. Use “Add medicine” to start the prescription.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {items.map((it) => (
              <PrescriptionItemRow
                key={it.tempId}
                item={it}
                onChange={(patch) => updateItem(it.tempId, patch)}
                onRemove={() => removeItem(it.tempId)}
              />
            ))}
          </Stack>
        )}

        <TextField
          label="Prescription notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          minRows={2}
          fullWidth
        />
      </Box>

      <Box
        sx={{
          borderRadius: "16px",
          border: `1px solid ${meridian.border}`,
          backgroundColor: meridian.surface,
          boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
          px: 3,
          py: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography sx={{ fontSize: "0.8125rem", color: hasCritical ? meridian.danger : meridian.textSecondary }}>
            {items.length} medicine{items.length === 1 ? "" : "s"}
            {hasCritical ? " · resolve critical alerts before saving" : ""}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              sx={btnSx}
              disabled={items.length === 0}
              onClick={() => window.print()}
            >
              Print / PDF
            </Button>
            <Button
              variant="contained"
              sx={btnSx}
              disabled={items.length === 0 || saving || hasCritical}
              onClick={save}
            >
              {saving ? "Saving…" : "Save prescription"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <MedicineSearchModal open={pickOpen} onClose={() => setPickOpen(false)} onPick={addMedicine} />
      <PrescriptionPrintView context={context} items={items} notes={notes} />
    </Box>
  );
}
