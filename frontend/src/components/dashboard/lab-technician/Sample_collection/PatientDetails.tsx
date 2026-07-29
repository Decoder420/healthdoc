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

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        mb: 0.5,
      }}
    >
      {label}
    </Typography>

    <Typography fontWeight={600}>
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
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          Search and select a patient to view details.
        </Typography>
      </Paper>
    );
  }


  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >

      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
      >
        Patient Information
      </Typography>


      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 3,
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