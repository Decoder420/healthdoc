"use client";

import Box from "@mui/material/Box";

import { DoctorDashboard } from "@/features/doctor";
import { doctorPageSx } from "@/features/doctor/panelSx";

export default function Page() {
  return (
    <Box sx={doctorPageSx}>
      <DoctorDashboard />
    </Box>
  );
}
