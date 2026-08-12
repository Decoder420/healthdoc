"use client";

import ScannerOutlinedIcon from "@mui/icons-material/ScannerOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";

import {
  Avatar,
  Box,
  Chip,
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
      | "PET-CT"
      | "ECG";
    bodyPart: string;
    studyDate: string;
    studyTime: string;
    priority: "Routine" | "Urgent" | "Stat";
    technician: string;
    machine: string;
    contrast?: string;
  };
}

interface InfoItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 32,
            height: 32,
            minWidth: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1.5,
            bgcolor: "grey.100",
            color: "primary.main",
          }}
        >
          {icon}
        </Box>
      )}

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 600,
            color: "text.secondary",
            lineHeight: 1.2,
            mb: 0.4,
            textTransform: "uppercase",
            letterSpacing: 0.35,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "-"}
        </Typography>
      </Box>
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
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1.5, md: 3 }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "primary.main",
              }}
            >
              <ScannerOutlinedIcon fontSize="small" />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  fontSize={16}
                  fontWeight={700}
                  lineHeight={1.3}
                >
                  {study.studyName}
                </Typography>

                <Chip
                  label={study.modality}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    height: 21,
                    fontSize: 10.5,
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography
                fontSize={12}
                color="text.secondary"
                lineHeight={1.4}
              >
                {study.bodyPart} • {study.studyDate}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={study.priority}
            color={priorityColor}
            size="small"
            sx={{
              height: 24,
              fontWeight: 700,
              fontSize: 11,
            }}
          />
        </Stack>
      </Box>

      {/* Study Information */}
      <Box px={2.5} py={2}>
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Accession No."
              value={study.accessionNo}
              icon={
                <BadgeOutlinedIcon
                  sx={{ fontSize: 17 }}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Study ID"
              value={study.studyId}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Modality"
              value={study.modality}
              icon={
                <ScannerOutlinedIcon
                  sx={{ fontSize: 17 }}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Body Part"
              value={study.bodyPart}

            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Study Date & Time"
              value={`${study.studyDate} • ${study.studyTime}`}
              icon={
                <CalendarMonthOutlinedIcon
                  sx={{ fontSize: 17 }}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Technician"
              value={study.technician}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Machine"
              value={study.machine}
              icon={
                <PrecisionManufacturingOutlinedIcon
                  sx={{ fontSize: 17 }}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InfoItem
              label="Contrast"
              value={study.contrast || "Not Used"}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
