"use client";

import Box from "@mui/material/Box";

import { OrdersWorkspace } from "@/features/doctor";
import { doctorPageSx } from "@/features/doctor/panelSx";
import { mockEncounterContext } from "@/lib/mock";

export default function Page() {
  return (
    <Box sx={doctorPageSx}>
      <OrdersWorkspace context={mockEncounterContext} />
    </Box>
  );
}
