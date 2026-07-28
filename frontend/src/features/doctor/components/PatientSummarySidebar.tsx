"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { StatusChip } from "@/components/ui/StatusChip";
import { meridian } from "@/styles/theme";
import { formatAgeSex } from "../lib/formatters";
import type { QueuePatient } from "../types";

const cardSx = {
  borderRadius: "16px",
  border: `1px solid ${meridian.border}`,
  background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
  boxShadow: "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
  p: 3,
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: meridian.textSecondary,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, mt: 0.25 }}>{value}</Typography>
    </Box>
  );
}

export interface PatientSummarySidebarProps {
  patient: QueuePatient | null;
}

export function PatientSummarySidebar({ patient }: PatientSummarySidebarProps) {
  if (!patient) {
    return (
      <Box sx={cardSx}>
        <Typography sx={{ color: meridian.textSecondary, fontSize: "0.875rem", textAlign: "center", py: 2 }}>
          Select a patient from the queue to see their summary.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ ...cardSx, display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography sx={{ fontSize: "1.0625rem", fontWeight: 700 }}>{patient.full_name}</Typography>
        <Box sx={{ mt: 0.75 }}>
          <StatusChip status={patient.status} />
        </Box>
      </Box>

      <Divider />

      <Stack spacing={1.5}>
        <Field label="Token" value={patient.token_display} />
        <Field label="UHID" value={patient.uhid} />
        <Field label="Visit ID" value={patient.visit_id} />
        <Field label="Age / Sex" value={formatAgeSex(patient.age_years, patient.sex)} />
        <Field label="Last Visit" value={patient.last_visit_date ?? "First visit"} />
      </Stack>

      <Divider />

      <Box>
        <Typography
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: meridian.textSecondary,
            mb: 1,
          }}
        >
          Known Allergies
        </Typography>
        {patient.known_allergies && patient.known_allergies.length > 0 ? (
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {patient.known_allergies.map((a) => (
              <Box
                key={a}
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  px: 1,
                  py: 0.25,
                  borderRadius: "8px",
                  color: meridian.danger,
                  backgroundColor: "#fee2e2",
                  border: "1px solid rgb(185 28 28 / 0.18)",
                }}
              >
                {a}
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
            None recorded.
          </Typography>
        )}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: meridian.textSecondary,
            mb: 1,
          }}
        >
          Previous Diagnoses
        </Typography>
        {patient.previous_diagnoses && patient.previous_diagnoses.length > 0 ? (
          <Stack spacing={0.5}>
            {patient.previous_diagnoses.map((d, i) => (
              <Typography key={i} sx={{ fontSize: "0.8125rem" }}>
                • {d}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textSecondary }}>
            None recorded.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
