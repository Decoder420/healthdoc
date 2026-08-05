"use client";

import {
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

export interface StudyDetails {
  modality: string;
  procedure: string;
  radiologist: string;
  referringDoctor: string;
  accessionNumber: string;
  orderId: string;
  appointmentDate: string;
  appointmentTime: string;
  studyStatus: string;
}

interface StudyDetailsCardProps {
  study: StudyDetails | null;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
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
}

export default function StudyDetailsCard({
  study,
}: StudyDetailsCardProps) {
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
          Study Details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Modality"
              value={study?.modality}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Procedure"
              value={study?.procedure}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Radiologist"
              value={study?.radiologist}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Referring Doctor"
              value={study?.referringDoctor}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Accession Number"
              value={study?.accessionNumber}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Order ID"
              value={study?.orderId}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Appointment Date"
              value={study?.appointmentDate}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailRow
              label="Appointment Time"
              value={study?.appointmentTime}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailRow
              label="Study Status"
              value={study?.studyStatus}
            />
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}