"use client";

import {
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

export interface PatientDetails {
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  patientId: string;
  visitId: string;
  token: string;
  priority: string;
}

interface PatientDetailsCardProps {
  patient: PatientDetails | null;
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <Stack spacing={0.5}>
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={600}
    >
      {label}
    </Typography>

    <Typography variant="body1">
      {value || "-"}
    </Typography>
  </Stack>
);

export default function PatientDetailsCard({
  patient,
}: PatientDetailsCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={600}>
          Patient Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Patient Name"
              value={patient?.patientName}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="UHID"
              value={patient?.uhid}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Patient ID"
              value={patient?.patientId}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Age"
              value={patient?.age}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Gender"
              value={patient?.gender}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Visit ID"
              value={patient?.visitId}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Token"
              value={patient?.token}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Priority"
              value={patient?.priority}
            />
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}