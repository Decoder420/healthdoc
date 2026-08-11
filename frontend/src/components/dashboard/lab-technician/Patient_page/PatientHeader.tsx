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
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import BloodtypeRoundedIcon from "@mui/icons-material/BloodtypeRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

interface Props {
  patient: any;
}

export default function PatientHeader({
  patient,
}: Props) {
  const router = useRouter();

  const getStatusColor = (
    status?: string
  ):
    | "success"
    | "warning"
    | "primary"
    | "secondary"
    | "info"
    | "error"
    | "default" => {
    switch (status) {
      case "VERIFIED":
        return "success";

      case "PROCESSING":
        return "warning";

      case "READY":
        return "primary";

      case "COLLECTED":
        return "secondary";

      case "QUEUE":
        return "info";

      case "RECOLLECTION_REQUIRED":
        return "error";

      default:
        return "default";
    }
  };

  const initials =
    patient?.patient?.name
      ?.split(" ")
      .map((name: string) => name[0])
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
              Patient Profile
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Patient information and laboratory
              details
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={patient?.status ?? "UNKNOWN"}
          color={getStatusColor(patient?.status)}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 0.5,
          }}
        />
      </Stack>

      {/* =========================================
          PATIENT SUMMARY CARD
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
                    {patient?.patient?.name ??
                      "Unknown Patient"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {patient?.patient?.patientId ??
                      "-"}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={
                    patient?.patient?.gender ??
                    "Unknown"
                  }
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
                    value={
                      patient?.patient?.uhid ?? "-"
                    }
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
                    value={
                      patient?.patient?.patientId ??
                      "-"
                    }
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
                    icon={<PhoneRoundedIcon />}
                    title="Mobile"
                    value={
                      patient?.patient?.mobile ?? "-"
                    }
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
                    icon={<BloodtypeRoundedIcon />}
                    title="Age / Gender"
                    value={`${patient?.patient?.age ?? "-"} Years • ${
                      patient?.patient?.gender ?? "-"
                    }`}
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={
                      <MedicalServicesRoundedIcon />
                    }
                    title="Consultant"
                    value={
                      patient?.doctor?.name ?? "-"
                    }
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={
                      <LocalHospitalRoundedIcon />
                    }
                    title="Department"
                    value={
                      patient?.doctor?.department ??
                      "-"
                    }
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
                    title="Visit Type"
                    value={
                      patient?.visit?.visitType ??
                      "-"
                    }
                  />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Info
                    icon={<BadgeRoundedIcon />}
                    title="Visit ID"
                    value={
                      patient?.visit?.visitId ?? "-"
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3.5 }} />

          {/* =====================================
              REQUESTED TESTS
              ===================================== */}

          <Stack spacing={1.5}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <ScienceRoundedIcon
                fontSize="small"
                color="primary"
              />

              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Requested Tests
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              {patient?.requestedTests?.length ? (
                patient.requestedTests.map(
                  (test: string) => (
                    <Chip
                      key={test}
                      label={test}
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    />
                  )
                )
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No tests requested
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* =========================================
          VISIT / STATUS SUMMARY
          ========================================= */}

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
          <SummaryCard
            icon={<AccessTimeRoundedIcon />}
            label="Current Status"
            value={patient?.status ?? "-"}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <SummaryCard
            icon={<EventRoundedIcon />}
            label="Visit Type"
            value={
              patient?.visit?.visitType ?? "-"
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <SummaryCard
            icon={<ScienceRoundedIcon />}
            label="Total Tests"
            value={String(
              patient?.requestedTests?.length ?? 0
            )}
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

      <Box
        sx={{
          minWidth: 0,
        }}
      >
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

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {label}
            </Typography>

            <Typography
              variant="body1"
              fontWeight={700}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}