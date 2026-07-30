"use client";

import Box from "@mui/material/Box";

import { DoctorDashboard } from "@/features/doctor";

export default function Page() {
  return (
    <Box sx={{ mx: "auto", maxWidth: 1280, px: { xs: 2, md: 3 }, py: 3 }}>
      <DoctorDashboard />
    </Box>
  );
}
