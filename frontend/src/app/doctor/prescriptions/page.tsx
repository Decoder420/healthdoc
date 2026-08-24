"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import { PrescriptionWorkspace } from "@/features/doctor";
import { newProvisionalEncounter } from "@/features/doctor/lib/encounter";
import { doctorPageSx } from "@/features/doctor/panelSx";
import { useEncounterContext } from "@/features/doctor/hooks/useEncounterContext";
import type { EncounterContext } from "@/features/doctor/types";

/**
 * Split out so the provisional encounter is created ONCE, from a context that
 * is already known.
 *
 * `newProvisionalEncounter` seeds the encounter a prescription is written
 * against. Calling it in the parent would mean calling it before the queue has
 * loaded — useState's initialiser runs on first render and never again, so the
 * encounter would be built from a null context and then never corrected.
 */
function PrescribeFor({ context }: { context: EncounterContext }) {
  const [encounter] = React.useState(() => newProvisionalEncounter(context));

  return (
    <Box sx={doctorPageSx}>
      <PrescriptionWorkspace context={context} encounter={encounter} />
    </Box>
  );
}

export default function Page() {
  const { context, loading } = useEncounterContext();

  // No fallback patient. mockEncounterContext supplied the visit_id and
  // patient_id a prescription is FILED AGAINST, not just the name in the
  // header — a wrong one attaches a drug order to the wrong visit. If no token
  // is in service there is no consultation to prescribe into.
  if (loading) return null;
  if (!context) {
    return (
      <Box sx={doctorPageSx}>
        <p>
          No patient is currently in service. Call a token from your queue to
          begin a consultation.
        </p>
      </Box>
    );
  }

  return <PrescribeFor context={context} />;
}
