"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";

import type {
  RadiologyQueueItem,
  RadiologyQueueStatus,
} from "@/components/dashboard/radiology/test_queue/DummyData";

interface Props {
  patient: RadiologyQueueItem;
}

export default function PatientOverview({
  patient,
}: Props) {
  const priorityColor = (
    priority: RadiologyQueueItem["priority"]
  ): "error" | "warning" | "success" => {
    switch (priority) {
      case "Emergency":
        return "error";

      case "Urgent":
        return "warning";

      default:
        return "success";
    }
  };

  const statusColor = (
    status: RadiologyQueueStatus
  ): "info" | "warning" | "success" | "default" => {
    switch (status) {
      case "Queue":
        return "info";

      case "Processing":
        return "warning";

      case "Verified":
        return "success";

      default:
        return "default";
    }
  };

  const reportStatusColor = (
    status: RadiologyQueueItem["reportStatus"]
  ): "info" | "warning" | "success" => {
    switch (status) {
      case "Verified":
        return "success";

      case "Draft":
        return "warning";

      default:
        return "info";
    }
  };

  return (
    <Grid container spacing={2}>
      {/* PATIENT DETAILS */}

      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <CompactCard
          icon={<PersonRoundedIcon />}
          title="Patient Details"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
          >
            <Grid size={{ xs: 6 }}>
              <Info
                label="Patient Name"
                value={patient.patientName}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Patient ID"
                value={patient.patientId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="UHID"
                value={patient.uhid}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Age / Gender"
                value={`${patient.age} Years • ${patient.gender}`}
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* STUDY / VISIT DETAILS */}

      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <CompactCard
          icon={<LocalHospitalRoundedIcon />}
          title="Study Information"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
          >
            <Grid size={{ xs: 6 }}>
              <Info
                label="Order ID"
                value={patient.orderId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Accession Number"
                value={patient.accessionNumber}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Visit ID"
                value={patient.visitId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Token"
                value={patient.token}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Priority"
                value={
                  <Chip
                    label={patient.priority}
                    size="small"
                    color={priorityColor(patient.priority)}
                    sx={{
                      height: 24,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                }
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Status"
                value={
                  <Chip
                    label={patient.status}
                    size="small"
                    color={statusColor(patient.status)}
                    sx={{
                      height: 24,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* IMAGING DETAILS */}

      <Grid size={{ xs: 12 }}>
        <CompactCard
          icon={<MonitorHeartRoundedIcon />}
          title="Imaging Details"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
          >
            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Modality"
                value={patient.modality}
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Procedure"
                value={patient.procedure}
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Radiologist"
                value={patient.radiologist}
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Image Count"
                value={`${patient.imageCount} Images`}
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Appointment Date"
                value={patient.appointmentDate}
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Appointment Time"
                value={patient.appointmentTime}
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* PACS INFORMATION */}

      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <CompactCard
          icon={<ImageRoundedIcon />}
          title="Imaging / PACS"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
          >
            <Grid size={{ xs: 6 }}>
              <Info
                label="DICOM Study ID"
                value={patient.dicomStudyId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Images"
                value={`${patient.imageCount}`}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Report ID"
                value={patient.reportId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Images Available"
                value={
                  <Chip
                    label={
                      patient.imageCount > 0
                        ? "Available"
                        : "Not Available"
                    }
                    size="small"
                    color={
                      patient.imageCount > 0
                        ? "success"
                        : "default"
                    }
                    sx={{
                      height: 24,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* REPORT INFORMATION */}

      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <CompactCard
          icon={<AssignmentRoundedIcon />}
          title="Report Information"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
          >
            <Grid size={{ xs: 6 }}>
              <Info
                label="Report ID"
                value={patient.reportId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Report Status"
                value={
                  <Chip
                    label={patient.reportStatus}
                    size="small"
                    color={reportStatusColor(
                      patient.reportStatus
                    )}
                    sx={{
                      height: 24,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                }
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Report Available"
                value={
                  <Chip
                    label={
                      patient.reportAvailable
                        ? "Available"
                        : "Not Available"
                    }
                    size="small"
                    color={
                      patient.reportAvailable
                        ? "success"
                        : "default"
                    }
                    sx={{
                      height: 24,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                }
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Radiologist"
                value={patient.radiologist}
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>
    </Grid>
  );
}

/* =============================================
   COMPACT CARD
   ============================================= */

function CompactCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      elevation={0}
      className="surface-card"
      sx={{
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",

              "& svg": {
                fontSize: 18,
              },
            }}
          >
            {icon}
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={700}
          >
            {title}
          </Typography>
        </Stack>

        <Divider
          sx={{
            mb: 1.5,
          }}
        />

        {children}
      </CardContent>
    </Card>
  );
}

/* =============================================
   COMPACT INFO
   ============================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        py: 0.5,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          lineHeight: 1.2,
          mb: 0.25,
        }}
      >
        {label}
      </Typography>

      {typeof value === "string" ? (
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          title={value}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
}