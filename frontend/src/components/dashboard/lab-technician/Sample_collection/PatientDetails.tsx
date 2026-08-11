"use client";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import type { Patient } from "./PatientSearch";

interface PatientDetailsProps {
  patient: Patient | null;
}

interface DetailItemProps {
  label: string;
  value?: string | number | null;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        mb: 0.25,
        fontSize: "0.7rem",
        lineHeight: 1.2,
      }}
    >
      {label}
    </Typography>

    <Typography
      variant="body2"
      fontWeight={600}
      noWrap
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={String(value || "-")}
    >
      {value || "-"}
    </Typography>
  </Box>
);

export default function PatientDetails({
  patient,
}: PatientDetailsProps) {
  if (!patient) {
    return (
      <Paper
        elevation={0}
        className="surface-card"
        sx={{
          px: 2.5,
          py: 2.5,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Search and select a patient to view details.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      className="surface-card"
      sx={{
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
          }}
        >
          Patient Information
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.3,
          }}
        >
          Patient and order details
        </Typography>
      </Box>

      {/* Details */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          columnGap: 4,
          rowGap: 2,
        }}
      >
        <DetailItem
          label="Patient Name"
          value={patient.patientName}
        />

        <DetailItem
          label="UHID"
          value={patient.uhid}
        />

        <DetailItem
          label="Order ID"
          value={patient.id}
        />

        <DetailItem
          label="Age / Gender"
          value={`${patient.age} Years / ${patient.gender}`}
        />

        <DetailItem
          label="Mobile"
          value={patient.mobile}
        />

        <DetailItem
          label="Doctor"
          value={patient.doctor}
        />

        <DetailItem
          label="Department"
          value={patient.department}
        />
      </Box>
    </Paper>
  );
}
