"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/Button";
import { meridian } from "@/styles/theme";
import { usePrescription } from "../hooks/usePrescription";
import { formatAgeSex } from "../lib/formatters";
import { doctorPanelSx, doctorButtonSx } from "../panelSx";
import type { ActiveEncounter, EncounterContext } from "../types";
import { MedicineSearchModal } from "./MedicineSearchModal";
import { PrescriptionItemRow } from "./PrescriptionItemRow";
import { PrescriptionPrintView } from "./PrescriptionPrintView";
import { SafetyBanner } from "./SafetyBanner";
import { ALLERGY_OVERRIDE_REASON_MIN } from "../constants";

import "../prescription-print.css";

export interface PrescriptionWorkspaceProps {
  context: EncounterContext;
  /** The encounter this prescription belongs to — prescriptions.encounter_id. */
  encounter: ActiveEncounter;
}

/** Week 4 — e-Prescription: search, dosage/frequency/route, SOS, safety banners, print. */
export function PrescriptionWorkspace({ context, encounter }: PrescriptionWorkspaceProps) {
  const {
    items,
    notes,
    setNotes,
    alerts,
    checking,
    hasBlocking,
    needsOverride,
    overrideReason,
    setOverrideReason,
    overrideOk,
    saving,
    addMedicine,
    updateItem,
    removeItem,
    save,
  } = usePrescription(encounter, context);

  const [pickOpen, setPickOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ ...doctorPanelSx, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>Prescription</Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary, mt: 0.25 }}>
              {context.patient_name} · {formatAgeSex(context.age_years, context.sex)} · UHID {context.uhid} · Token{" "}
              {context.token_display}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" sx={doctorButtonSx} onClick={() => setPickOpen(true)}>
            + Add medicine
          </Button>
        </Stack>

        <SafetyBanner alerts={alerts} checking={checking} />

        {needsOverride && !hasBlocking && (
          <TextField
            label="Reason for prescribing despite the allergy"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            error={!overrideOk && overrideReason.length > 0}
            helperText={
              overrideOk
                ? "Recorded against the prescription and read during review."
                : `${ALLERGY_OVERRIDE_REASON_MIN - overrideReason.trim().length} more characters required.`
            }
          />
        )}

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
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "0.8125rem", color: hasBlocking ? meridian.danger : meridian.textSecondary }}>
            {items.length} medicine{items.length === 1 ? "" : "s"}
            {hasBlocking
              ? " · anaphylaxis alert cannot be overridden"
              : !overrideOk
                ? " · a reason is required for the allergy alert"
                : ""}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              sx={doctorButtonSx}
              disabled={items.length === 0}
              onClick={() => window.print()}
            >
              Print / PDF
            </Button>
            <Button
              variant="contained"
              sx={doctorButtonSx}
              disabled={items.length === 0 || saving || hasBlocking || !overrideOk}
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
