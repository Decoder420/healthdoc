"use client";

import ScannerOutlinedIcon from "@mui/icons-material/ScannerOutlined";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

export interface StudyCardProps {
  study: {
    accessionNo: string;
    studyId: string;
    studyName: string;
    modality:
      | "X-Ray"
      | "CT"
      | "MRI"
      | "Ultrasound"
      | "Mammography"
      | "PET-CT";
    bodyPart: string;
    studyDate: string;
    studyTime: string;
    priority: "Routine" | "Urgent" | "Stat";
    technician: string;
    machine: string;
    contrast?: string;
  };
}

interface RowProps {
  label: string;
  value?: string;
}

function Row({
  label,
  value,
}: RowProps) {
  return (
    <Stack
      direction="row"
      sx={{
        py: 1,
        borderBottom: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          width: 140,
          color: "text.secondary",
          fontWeight: 600,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {value || "-"}
      </Typography>
    </Stack>
  );
}

export default function StudyCard({
  study,
}: StudyCardProps) {
  const priorityColor =
    study.priority === "Stat"
      ? "error"
      : study.priority === "Urgent"
      ? "warning"
      : "success";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#F8FAFC",
          borderLeft: "6px solid",
          borderColor: "primary.main",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48,
              }}
            >
              <ScannerOutlinedIcon />
            </Avatar>

            <Box>
              <Typography
                fontWeight={700}
                fontSize={18}
              >
                Study Information
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Imaging Examination Details
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={study.priority}
            color={priorityColor}
            size="small"
            sx={{
              fontWeight: 600,
            }}
          />
        </Stack>
      </Box>

      <Divider />

      <Box p={3}>
        <Grid container spacing={4}>
          {/* Left */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Row
              label="Accession No."
              value={study.accessionNo}
            />

            <Row
              label="Study ID"
              value={study.studyId}
            />

            <Row
              label="Study"
              value={study.studyName}
            />

            <Row
              label="Modality"
              value={study.modality}
            />

            <Row
              label="Body Part"
              value={study.bodyPart}
            />
          </Grid>

          {/* Right */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Row
              label="Study Date"
              value={`${study.studyDate} • ${study.studyTime}`}
            />

            <Row
              label="Technician"
              value={study.technician}
            />

            <Row
              label="Machine"
              value={study.machine}
            />

            <Row
              label="Contrast"
              value={study.contrast || "Not Used"}
            />

            <Row
              label="Priority"
              value={study.priority}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}