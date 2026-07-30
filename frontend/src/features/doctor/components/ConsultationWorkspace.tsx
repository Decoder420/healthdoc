"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StatusChip } from "@/components/ui/StatusChip";
import { meridian } from "@/styles/theme";
import { useConsultation } from "../hooks/useConsultation";
import type { EncounterContext } from "../types";
import { ChiefComplaintPanel } from "./ChiefComplaintPanel";
import { DiagnosesPanel } from "./DiagnosesPanel";
import { EncounterHeaderPanel } from "./EncounterHeaderPanel";
import { OrdersPanel } from "./OrdersPanel";
import { VitalsPanel } from "./VitalsPanel";

const btnSx = { textTransform: "none", fontWeight: 600, borderRadius: "10px" } as const;

export interface ConsultationWorkspaceProps {
  context: EncounterContext;
}

/**
 * Week 3 consultation — single-purpose panels + a sticky bar for the encounter
 * row. Owns only encounters columns (encounter_type + chief_complaint); vitals,
 * diagnoses and orders each own their state and their own save. No SOAP, no
 * vitals-on-encounter.
 */
export function ConsultationWorkspace({ context }: ConsultationWorkspaceProps) {
  const {
    encounter,
    encounterType,
    setEncounterType,
    chiefComplaint,
    setChiefComplaint,
    status,
    saving,
    completing,
    canComplete,
    saveEncounter,
    complete,
  } = useConsultation(context);

  const ended = status === "completed";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <EncounterHeaderPanel
        context={context}
        startedAt={encounter.started_at}
        encounterType={encounterType}
        onEncounterTypeChange={setEncounterType}
      />
      <ChiefComplaintPanel value={chiefComplaint} onChange={setChiefComplaint} />
      <VitalsPanel encounter={encounter} />
      <DiagnosesPanel encounter={encounter} />
      <OrdersPanel encounter={encounter} />

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
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>Encounter</Typography>
            {ended ? (
              <StatusChip status="completed" label="Completed" />
            ) : status === "saved" ? (
              <StatusChip status="issued" label="Saved" />
            ) : (
              <StatusChip status="draft" label="Not saved" />
            )}
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button variant="contained" sx={btnSx} disabled={saving || ended} onClick={saveEncounter}>
              {saving ? "Saving…" : "Save encounter"}
            </Button>
            <Button variant="outlined" sx={btnSx} disabled={!canComplete || completing || ended} onClick={complete}>
              {completing ? "Completing…" : "Complete consultation"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
