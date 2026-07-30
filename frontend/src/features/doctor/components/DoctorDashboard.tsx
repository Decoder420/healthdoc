"use client";

import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import { useDoctorQueue } from "../hooks/useDoctorQueue";
import { DoctorQueuePanel } from "./DoctorQueuePanel";
import { PatientSummarySidebar } from "./PatientSummarySidebar";

/**
 * Week 2 — doctor dashboard. Queue worklist + patient summary side-by-side
 * (fixed desktop two-column layout — no responsive breakpoints by design).
 */
export function DoctorDashboard() {
  const { patients, loading, error, selected, select } = useDoctorQueue();

  // Prefer in_service, else waiting/called/recalled, else first row.
  useEffect(() => {
    if (loading || selected || patients.length === 0) return;
    const preferred =
      patients.find((p) => p.status === "in_service") ??
      patients.find(
        (p) => p.status === "waiting" || p.status === "called" || p.status === "recalled",
      ) ??
      patients[0];
    select(preferred);
  }, [loading, patients, selected, select]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          border: `1px solid ${meridian.border}`,
          background: `linear-gradient(110deg, ${meridian.muted} 0%, ${meridian.surface} 45%, #eef4fb 100%)`,
          boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 8px 24px rgb(0 31 84 / 0.05)",
          px: { xs: 2.5, md: 3 },
          py: { xs: 2, md: 2.25 },
        }}
      >
        <Typography
          sx={{
            m: 0,
            mb: 0.5,
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: meridian.textSecondary,
          }}
        >
          OPD · Doctor
        </Typography>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontSize: { xs: "1.375rem", md: "1.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: meridian.textPrimary,
            lineHeight: 1.2,
          }}
        >
          Queue dashboard
        </Typography>
        <Typography
          sx={{
            m: 0,
            mt: 0.6,
            fontSize: "0.875rem",
            color: meridian.textSecondary,
            maxWidth: 560,
            lineHeight: 1.45,
          }}
        >
          Today&apos;s worklist sorted by queue priority — select a patient, review summary, start
          consultation.
        </Typography>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 340px",
          gap: 3,
          alignItems: "start",
        }}
      >
        <DoctorQueuePanel
          patients={patients}
          loading={loading}
          selectedId={selected?.id ?? null}
          onSelect={select}
        />
        <Box sx={{ position: "sticky", top: 24 }}>
          <PatientSummarySidebar patient={selected} />
        </Box>
      </Box>
    </Box>
  );
}
