"use client";

import {
  Avatar,
  Box,
  Chip,
  Divider,
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

const DetailItem = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number;
  mono?: boolean;
}) => (
  <Stack spacing={0.35}>
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={700}
      sx={{
        fontSize: 10.5,
        textTransform: "uppercase",
        letterSpacing: 0.55,
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

export default function PatientDetailsCard({
  patient,
}: PatientDetailsCardProps) {
  const priority = patient?.priority;

  const priorityConfig =
    priority === "Emergency"
      ? {
          color: "error.main",
          bgcolor: "rgba(211, 47, 47, 0.08)",
          borderColor: "rgba(211, 47, 47, 0.25)",
        }
      : priority === "Urgent"
      ? {
          color: "warning.dark",
          bgcolor: "rgba(237, 108, 2, 0.08)",
          borderColor: "rgba(237, 108, 2, 0.25)",
        }
      : {
          color: "text.secondary",
          bgcolor: "action.hover",
          borderColor: "divider",
        };

  const initials =
    patient?.patientName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "P";

  return (
    <Box
      className="surface-card"
      sx={{
        height: "100%",
        overflow: "hidden",
      }}
    >
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
              sx={{ fontSize: 15 }}
            >
              Patient Details
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 11.5 }}
            >
              Identification & visit information
            </Typography>
          </Box>

          {priority && (
            <Chip
              label={priority}
              size="small"
              variant="outlined"
              sx={{
                height: 25,
                borderRadius: 1.5,
                fontSize: 10.5,
                fontWeight: 800,
                ...priorityConfig,
              }}
            />
          )}
        </Stack>
      </Box>

      <Divider />

      {/* Patient Identity */}
      <Box sx={{ px: 2.25, py: 1.75 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              fontSize: 14,
              fontWeight: 800,
              bgcolor: "primary.main",
            }}
          >
            {initials}
          </Avatar>

          <Box minWidth={0}>
            <Typography
              fontWeight={800}
              sx={{
                fontSize: 14,
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {patient?.patientName || "-"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 11,
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {patient?.uhid || "-"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Details */}
      <Box sx={{ px: 2.25, py: 1.75 }}>
        <Grid
          container
          columnSpacing={3}
          rowSpacing={2}
        >
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Patient ID"
              value={patient?.patientId}
              mono
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Visit ID"
              value={patient?.visitId}
              mono
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Age"
              value={
                patient?.age !== undefined
                  ? `${patient.age} Years`
                  : undefined
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Gender"
              value={patient?.gender}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Token"
              value={patient?.token}
              mono
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              label="Priority"
              value={patient?.priority}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}