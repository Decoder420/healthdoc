"use client";

import Box from "@mui/material/Box";

import { ResultsWorkspace } from "@/features/doctor";
import { doctorPageSx } from "@/features/doctor/panelSx";

export default function Page() {
  return (
    <Box sx={doctorPageSx}>
      <ResultsWorkspace />
    </Box>
  );
}
