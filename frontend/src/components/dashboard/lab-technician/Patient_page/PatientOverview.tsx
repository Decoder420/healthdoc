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
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";

interface Props {
  patient: any;
}

export default function PatientOverview({
  patient,
}: Props) {
  return (
    <Grid container spacing={3}>

      {/* ================= PATIENT DETAILS ================= */}

      <Grid size={{ xs: 12, md: 6 }}>
        <Card
          sx={{
            borderRadius: 4,
            height: "100%",
          }}
        >
          <CardContent>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={2}
            >
              <PersonRoundedIcon color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Patient Details
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Info
              label="Patient Name"
              value={patient.patient.name}
            />

            <Info
              label="Patient ID"
              value={patient.patient.patientId}
            />

            <Info
              label="UHID"
              value={patient.patient.uhid}
            />

            <Info
              label="Age"
              value={`${patient.patient.age} Years`}
            />

            <Info
              label="Gender"
              value={patient.patient.gender}
            />

            <Info
              label="Mobile"
              value={patient.patient.mobile}
            />

          </CardContent>
        </Card>
      </Grid>

      {/* ================= VISIT DETAILS ================= */}

      <Grid size={{ xs: 12, md: 6 }}>
        <Card
          sx={{
            borderRadius: 4,
            height: "100%",
          }}
        >
          <CardContent>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={2}
            >
              <LocalHospitalRoundedIcon color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Visit Information
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Info
              label="Visit ID"
              value={patient.visit.visitId}
            />

            <Info
              label="Visit Type"
              value={patient.visit.visitType}
            />

            <Info
              label="Consultant"
              value={patient.doctor.name}
            />

            <Info
              label="Department"
              value={patient.doctor.department}
            />

            <Info
              label="Priority"
              value={patient.order.priority}
            />

            <Info
              label="Ordered At"
              value={new Date(
                patient.order.orderedAt
              ).toLocaleString()}
            />

          </CardContent>
        </Card>
      </Grid>

      {/* ================= SAMPLE ================= */}

      <Grid size={{ xs: 12 }}>
        <Card
          sx={{
            borderRadius: 4,
          }}
        >
          <CardContent>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={2}
            >
              <ScienceRoundedIcon color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Sample Information
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>

              <Grid size={{ xs: 6, md: 3 }}>
                <Info
                  label="Barcode"
                  value={
                    patient.sample.barcode || "--"
                  }
                />
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Info
                  label="Sample Type"
                  value={
                    patient.sample.sampleType || "--"
                  }
                />
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Info
                  label="Container"
                  value={
                    patient.sample.container || "--"
                  }
                />
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Info
                  label="Collected At"
                  value={
                    patient.sample.collectedAt || "--"
                  }
                />
              </Grid>

            </Grid>

          </CardContent>
        </Card>
      </Grid>

      {/* ================= REQUESTED TESTS ================= */}

      <Grid size={{ xs: 12 }}>
        <Card
          sx={{
            borderRadius: 4,
          }}
        >
          <CardContent>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={2}
            >
              <AssignmentRoundedIcon color="primary" />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Requested Laboratory Tests
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              {patient.requestedTests.map(
                (test: string) => (
                  <Chip
                    key={test}
                    label={test}
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                    }}
                  />
                )
              )}
            </Stack>

          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box mb={2}>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        fontWeight={600}
      >
        {value}
      </Typography>
    </Box>
  );
}