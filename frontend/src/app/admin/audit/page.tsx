"use client";

import Box from "@mui/material/Box";

import { AuditTrailDashboard } from "@/features/audit-viewer";

export default function Page() {
  return (
    <Box sx={{ mx: "auto", maxWidth: 1280, px: { xs: 2, md: 3 }, py: 3 }}>
      <AuditTrailDashboard />
    </Box>
  );
}
