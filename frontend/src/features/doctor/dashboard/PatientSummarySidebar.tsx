"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { StatusChip } from "@/components/ui/StatusChip";
import type { QueuePatient } from "./mockQueue";

export interface PatientSummarySidebarProps {
  patient: QueuePatient | null;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, mt: 0.25 }}>{value}</Typography>
    </Box>
  );
}

export function PatientSummarySidebar({ patient }: PatientSummarySidebarProps) {
  if (!patient) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: "16px", textAlign: "center" }}>
        <Typography sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
          Select a patient from the queue to see their summary.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: "16px", display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>{patient.full_name}</Typography>
        <Box sx={{ mt: 0.75 }}>
          <StatusChip status={patient.status} />
        </Box>
      </Box>

      <Divider />

      <Stack spacing={1.5}>
        <Field label="UHID" value={patient.uhid} />
        <Field label="Visit ID" value={patient.visitId} />
        <Field label="Age / Sex" value={`${patient.age_years} yrs, ${patient.sex}`} />
        <Field label="Last Visit" value={patient.lastVisitDate ?? "First visit"} />
      </Stack>

      <Divider />

      <Box>
        <Typography sx={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary", mb: 1 }}>
          Previous Diagnoses
        </Typography>
        {patient.previousDiagnoses && patient.previousDiagnoses.length > 0 ? (
          <Stack spacing={0.5}>
            {patient.previousDiagnoses.map((d, i) => (
              <Typography key={i} sx={{ fontSize: "0.8125rem" }}>
                • {d}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>None recorded.</Typography>
        )}
      </Box>
    </Paper>
  );
}   