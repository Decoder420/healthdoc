"use client";

import * as React from "react";
import Box from "@mui/material/Box";

import { PrescriptionWorkspace } from "@/features/doctor";
import { newProvisionalEncounter } from "@/features/doctor/lib/encounter";
import { doctorPageSx } from "@/features/doctor/panelSx";
import { mockEncounterContext } from "@/lib/mock";

export default function Page() {
  const [encounter] = React.useState(() => newProvisionalEncounter(mockEncounterContext));

  return (
    <Box sx={doctorPageSx}>
      <PrescriptionWorkspace context={mockEncounterContext} encounter={encounter} />
    </Box>
  );
}
