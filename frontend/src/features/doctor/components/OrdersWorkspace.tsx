"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import type { ActiveEncounter, EncounterContext } from "../types";
import { OrdersPanel } from "./OrdersPanel";

export interface OrdersWorkspaceProps {
  context: EncounterContext;
}

/** Standalone /doctor/orders view — the same Orders panel used in the consultation. */
export function OrdersWorkspace({ context }: OrdersWorkspaceProps) {
  const [encounter] = React.useState<ActiveEncounter>(() => ({
    encounter_id: crypto.randomUUID(),
    visit_id: context.visit_id,
    patient_id: context.patient_id,
    provider_user_id: context.provider_user_id,
    started_at: new Date().toISOString(),
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <OrdersPanel encounter={encounter} />
    </Box>
  );
}
