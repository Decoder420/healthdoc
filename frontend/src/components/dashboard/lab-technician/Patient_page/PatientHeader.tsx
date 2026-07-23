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

interface Props {
  patient: any;
}

export default function PatientHeader({
  patient,
}: Props) {
  const router = useRouter();

  const getStatusColor = (
    status: string
  ) => {
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

      default:
        return "default";
    }
  };

  return (
    <>
      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
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
          >
            Back
          </Button>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Patient Profile
          </Typography>
        </Stack>

        <Chip
          label={patient.status}
          color={
            getStatusColor(patient.status) as any
          }
        />
      </Stack>

      {/* Main Card */}

      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid
            container
            spacing={4}
            alignItems="center"
          >
            {/* Avatar */}

            <Grid size={{ xs: 12, md: 2 }}>
              <Stack
                alignItems="center"
                spacing={2}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  {patient.patient.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </Avatar>

                <Typography
                  fontWeight={700}
                >
                  {patient.patient.name}
                </Typography>
              </Stack>
            </Grid>

            {/* Details */}

            <Grid size={{ xs: 12, md: 10 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Info
                    icon={<BadgeRoundedIcon />}
                    title="UHID"
                    value={patient.patient.uhid}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Info
                    icon={<PersonRoundedIcon />}
                    title="Patient ID"
                    value={
                      patient.patient.patientId
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Info
                    icon={<PhoneRoundedIcon />}
                    title="Mobile"
                    value={
                      patient.patient.mobile
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Info
                    icon={
                      <BloodtypeRoundedIcon />
                    }
                    title="Gender"
                    value={`${patient.patient.gender} • ${patient.patient.age} Years`}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={
                      <MedicalServicesRoundedIcon />
                    }
                    title="Consultant"
                    value={
                      patient.doctor.name
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={
                      <LocalHospitalRoundedIcon />
                    }
                    title="Department"
                    value={
                      patient.doctor.department
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={<EventRoundedIcon />}
                    title="Visit Type"
                    value={
                      patient.visit.visitType
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Info
                    icon={<BadgeRoundedIcon />}
                    title="Visit ID"
                    value={
                      patient.visit.visitId
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            {patient.requestedTests.map(
              (test: string) => (
                <Chip
                  key={test}
                  label={test}
                  color="primary"
                  variant="outlined"
                />
              )
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

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
      spacing={2}
      alignItems="center"
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          bgcolor: "action.hover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          fontWeight={600}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}