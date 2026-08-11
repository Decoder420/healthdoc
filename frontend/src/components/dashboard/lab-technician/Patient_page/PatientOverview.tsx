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
    <Grid
      container
      spacing={2}
    >
      {/* =========================================
          PATIENT DETAILS
          ========================================= */}

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
                value={patient.patient.name}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Patient ID"
                value={patient.patient.patientId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="UHID"
                value={patient.patient.uhid}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Age / Gender"
                value={`${patient.patient.age} Years • ${patient.patient.gender}`}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Info
                label="Mobile"
                value={patient.patient.mobile}
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* =========================================
          VISIT DETAILS
          ========================================= */}

      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <CompactCard
          icon={<LocalHospitalRoundedIcon />}
          title="Visit Information"
        >
          <Grid
            container
            columnSpacing={3}
            rowSpacing={1}
          >
            <Grid size={{ xs: 6 }}>
              <Info
                label="Visit ID"
                value={patient.visit.visitId}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Visit Type"
                value={patient.visit.visitType}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Consultant"
                value={patient.doctor.name}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Department"
                value={patient.doctor.department}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Info
                label="Priority"
                value={
                  <Chip
                    label={patient.order.priority}
                    size="small"
                    color="primary"
                    variant="outlined"
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
                label="Ordered At"
                value={new Date(
                  patient.order.orderedAt
                ).toLocaleString()}
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* =========================================
          SAMPLE INFORMATION
          ========================================= */}

      <Grid
        size={{
          xs: 12,
        }}
      >
        <CompactCard
          icon={<ScienceRoundedIcon />}
          title="Sample Information"
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
                label="Barcode"
                value={
                  patient.sample.barcode || "--"
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Sample Type"
                value={
                  patient.sample.sampleType || "--"
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Container"
                value={
                  patient.sample.container || "--"
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 6,
                sm: 3,
              }}
            >
              <Info
                label="Collected At"
                value={
                  patient.sample.collectedAt || "--"
                }
              />
            </Grid>
          </Grid>
        </CompactCard>
      </Grid>

      {/* =========================================
          REQUESTED TESTS
          ========================================= */}

      <Grid
        size={{
          xs: 12,
        }}
      >
        <CompactCard
          icon={<AssignmentRoundedIcon />}
          title="Requested Laboratory Tests"
        >
          <Stack
            direction="row"
            spacing={1}
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
                  size="small"
                  sx={{
                    height: 28,
                    borderRadius: 1.5,
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                />
              )
            )}
          </Stack>
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
