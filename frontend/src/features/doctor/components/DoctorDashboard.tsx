"use client";

import Box from "@mui/material/Box";

import { useDoctorQueue } from "../hooks/useDoctorQueue";
import { DoctorQueuePanel } from "./DoctorQueuePanel";
import { PatientSummarySidebar } from "./PatientSummarySidebar";

/**
 * Week 2 — doctor dashboard. Queue worklist + patient summary side-by-side
 * (fixed desktop two-column layout — no responsive breakpoints by design).
 */
export function DoctorDashboard() {
  const { patients, loading, selected, select } = useDoctorQueue();

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 3, alignItems: "start" }}>
      <DoctorQueuePanel patients={patients} loading={loading} onSelect={select} />
      <Box sx={{ position: "sticky", top: 24 }}>
        <PatientSummarySidebar patient={selected} />
      </Box>
    </Box>
  );
}
