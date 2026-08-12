"use client";

import {
  Box,
  Chip,
  Divider,
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

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number;
  mono?: boolean;
}) {
  return (
    <Stack spacing={0.3}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={700}
        sx={{
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={{
          fontSize: 13,
          lineHeight: 1.4,
          fontFamily: mono
            ? "IBM Plex Mono, monospace"
            : "inherit",
        }}
      >
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? value
          : "-"}
      </Typography>
    </Stack>
  );
}

export default function StudyDetailsCard({
  study,
}: StudyDetailsCardProps) {
  const status = study?.studyStatus;

  const statusConfig =
    status === "Verified"
      ? {
          label: "Verified",
          color: "success.main",
          bgcolor: "rgba(46, 125, 50, 0.08)",
          borderColor: "rgba(46, 125, 50, 0.2)",
        }
      : status === "Processing"
      ? {
          label: "Processing",
          color: "warning.dark",
          bgcolor: "rgba(237, 108, 2, 0.08)",
          borderColor: "rgba(237, 108, 2, 0.2)",
        }
      : {
          label: status || "Unknown",
          color: "text.secondary",
          bgcolor: "action.hover",
          borderColor: "divider",
        };

  return (
    <Box className="surface-card">
      {/* Header */}
      <Box
        sx={{
          px: 2.25,
          py: 1.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{
                fontSize: 15,
              }}
            >
              Study Details
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 11.5,
              }}
            >
              Imaging study and appointment information
            </Typography>
          </Box>

          {study?.studyStatus && (
            <Chip
              label={statusConfig.label}
              size="small"
              variant="outlined"
              sx={{
                height: 25,
                borderRadius: 1.5,
                fontSize: 10.5,
                fontWeight: 800,
                color: statusConfig.color,
                bgcolor: statusConfig.bgcolor,
                borderColor:
                  statusConfig.borderColor,
              }}
            />
          )}
        </Stack>
      </Box>

      <Divider />

      {/* Study Information */}
      <Box
        sx={{
          px: 2.25,
          py: 1.75,
        }}
      >
        <Grid
          container
          columnSpacing={3}
          rowSpacing={1.75}
        >
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Modality"
              value={study?.modality}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Procedure"
              value={study?.procedure}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Radiologist"
              value={study?.radiologist}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Referring Doctor"
              value={study?.referringDoctor}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Accession Number"
              value={study?.accessionNumber}
              mono
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Order ID"
              value={study?.orderId}
              mono
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* Appointment */}
      <Box
        sx={{
          px: 2.25,
          py: 1.5,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{
            fontSize: 10.5,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Appointment
        </Typography>

        <Grid
          container
          columnSpacing={3}
          sx={{
            mt: 1.25,
          }}
        >
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Date"
              value={study?.appointmentDate}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Time"
              value={study?.appointmentTime}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
