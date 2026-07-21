"use client";

/**
 * PREVIEW ROUTE — visit /doctor/dashboard-preview locally.
 * Once confirmed, this logic moves into the real
 * app/doctor/dashboard/page.tsx (currently a placeholder stub).
 */

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DoctorQueuePanel } from "@/features/doctor/dashboard/DoctorQueuePanel";
import { PatientSummarySidebar } from "@/features/doctor/dashboard/PatientSummarySidebar";
import type { QueuePatient } from "@/features/doctor/dashboard/mockQueue";

export default function DoctorDashboardPreview() {
  const [selected, setSelected] = React.useState<QueuePatient | null>(null);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Doctor Dashboard
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 3, alignItems: "flex-start" }}>
        <DoctorQueuePanel onSelectPatient={setSelected} />
        <PatientSummarySidebar patient={selected} />
      </Box>
    </Box>
  );
}