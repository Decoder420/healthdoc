"use client";

import { useRouter } from "next/navigation";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";

import type {
  RadiologyQueueItem,
} from "@/components/dashboard/radiology/test_queue/DummyData";

interface Props {
  patient: RadiologyQueueItem;
}

export default function RadiologyPatientHeader({
  patient,
}: Props) {
  const router = useRouter();

  const getStatusColor = (
    status?: RadiologyQueueItem["status"]
  ):
    | "success"
    | "warning"
    | "primary"
    | "secondary"
    | "info"
    | "error"
    | "default" => {
    switch (status) {
      case "Verified":
        return "success";

      case "Processing":
        return "warning";

      case "Queue":
        return "info";

      case "No Show":
        return "secondary";

      case "Removed":
        return "error";

      default:
        return "default";
    }
  };

  const getPriorityColor = (
    priority?: RadiologyQueueItem["priority"]
  ):
    | "success"
    | "warning"
    | "error"
    | "default" => {
    switch (priority) {
      case "Emergency":
        return "error";

      case "Urgent":
        return "warning";

      case "Routine":
        return "success";

      default:
        return "default";
    }
  };

  const initials =
    patient.patientName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2) ?? "P";

  return (
    <Stack spacing={3}>
      {/* =========================================
          TOP HEADER
          ========================================= */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => router.back()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back
          </Button>

          <Box>
            <Typography
              variant="h5"
              fontWeight={750}
              sx={{
                letterSpacing: "-0.02em",
              }}
            >
              Radiology Patient Profile
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Patient, study and imaging information
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            label={patient.status}
            color={getStatusColor(patient.status)}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
            }}
          />

          <Chip
            label={patient.priority}
            color={getPriorityColor(patient.priority)}
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
            }}
          />
        </Stack>
      </Stack>

      {/* =========================================
          PATIENT SUMMARY
          ========================================= */}

      <Card
        elevation={0}
        className="surface-card"
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },
          }}
        >
          <Grid
            container
            spacing={4}
          >
            {/* =====================================
                PATIENT IDENTITY
                ===================================== */}

            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <Stack
                alignItems={{
                  xs: "flex-start",
                  md: "center",
                }}
                textAlign={{
                  xs: "left",
                  md: "center",
                }}
                spacing={1.5}
              >
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    fontSize: 30,
                    fontWeight: 700,
                    bgcolor: "primary.main",
                  }}
                >
                  {initials}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={750}
                  >
                    {patient.patientName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {patient.patientId}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={`${patient.gender} • ${patient.age} Years`}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                  }}
                />
              </Stack>
            </Grid>

            {/* =====================================
                PATIENT DETAILS
                ===================================== */}

            <Grid
              size={{
                xs: 12,
                md: 9,
              }}
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                >
                  <Info
                    icon={<BadgeRoundedIcon />}
                    title="UHID"
                    value={patient.uhid}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                >
                  <Info
                    icon={<PersonRoundedIcon />}
                    title="Patient ID"
                    value={patient.patientId}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                >
                  <Info
                    icon={<AssignmentRoundedIcon />}
                    title="Order ID"
                    value={patient.orderId}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                >
                  <Info
                    icon={<BadgeRoundedIcon />}
                    title="Visit ID"
                    value={patient.visitId}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={<MonitorHeartRoundedIcon />}
                    title="Modality"
                    value={patient.modality}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={<ScienceRoundedIcon />}
                    title="Procedure"
                    value={patient.procedure}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={<MedicalServicesRoundedIcon />}
                    title="Radiologist"
                    value={patient.radiologist}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={<EventRoundedIcon />}
                    title="Appointment"
                    value={`${patient.appointmentDate} • ${patient.appointmentTime}`}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3.5 }} />

          {/* =====================================
              IMAGING STUDY
              ===================================== */}

          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <ImageRoundedIcon
                fontSize="small"
                color="primary"
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Imaging Study
              </Typography>
            </Stack>

            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <StudyInfo
                  label="Accession Number"
                  value={patient.accessionNumber}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <StudyInfo
                  label="DICOM Study ID"
                  value={patient.dicomStudyId}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <StudyInfo
                  label="Images"
                  value={`${patient.imageCount} Images`}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* =========================================
          SUMMARY CARDS
          ========================================= */}

      <Grid
        container
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard
            icon={<MonitorHeartRoundedIcon />}
            label="Modality"
            value={patient.modality}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard
            icon={<ImageRoundedIcon />}
            label="Images"
            value={String(patient.imageCount)}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard
            icon={<EventRoundedIcon />}
            label="Appointment"
            value={`${patient.appointmentDate} • ${patient.appointmentTime}`}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <SummaryCard
            icon={<PriorityHighRoundedIcon />}
            label="Priority"
            value={patient.priority}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

/* =============================================
   INFORMATION ITEM
   ============================================= */

function Info({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        bgcolor: "action.hover",
        height: "100%",
        minHeight: 70,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          minWidth: 40,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{
            mb: 0.25,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={700}
          noWrap
          title={value}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

/* =============================================
   STUDY INFORMATION
   ============================================= */

function StudyInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        minHeight: 70,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={700}
        noWrap
        title={value}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* =============================================
   SUMMARY CARD
   ============================================= */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card
      elevation={0}
      className="surface-card"
    >
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {label}
            </Typography>

            <Typography
              variant="body1"
              fontWeight={700}
              noWrap
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}