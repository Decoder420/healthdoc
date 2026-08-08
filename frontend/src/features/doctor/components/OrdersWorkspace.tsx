"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import { newProvisionalEncounter } from "../lib/encounter";
import type { ActiveEncounter, EncounterContext } from "../types";
import { OrdersPanel } from "./OrdersPanel";

export interface OrdersWorkspaceProps {
  context: EncounterContext;
}

/** Standalone /doctor/orders view — the same Orders panel used in the consultation. */
export function OrdersWorkspace({ context }: OrdersWorkspaceProps) {
  const [encounter] = React.useState<ActiveEncounter>(() => newProvisionalEncounter(context));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <OrdersPanel encounter={encounter} />
    </Box>
  );
}
