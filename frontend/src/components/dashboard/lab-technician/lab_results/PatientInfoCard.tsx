"use client";

import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

import { LabPatientOrder } from "@/lib/mock/lab_data";

interface Props {
  patient: LabPatientOrder["patient"];
  doctor: LabPatientOrder["doctor"];
  visit: LabPatientOrder["visit"];
}

interface FieldProps {
  label: string;
  value?: string | number | null;
}

function Field({ label, value }: FieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Stack spacing={0.25}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: "0.7rem",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={String(value ?? "--")}
        >
          {value ?? "--"}
        </Typography>
      </Stack>
    </Grid>
  );
}

export default function PatientInfoCard({
  patient,
  doctor,
  visit,
}: Props) {
  return (
    <Paper
      elevation={0}
      className="surface-card"
      sx={{
        mt: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
          }}
        >
          Patient Information
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
          }}
        >
          Patient, visit and referring doctor details
        </Typography>
      </Box>

      {/* Details */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
        }}
      >
        <Grid
          container
          columnSpacing={3}
          rowSpacing={1.75}
        >
          <Field
            label="Patient Name"
            value={patient.name}
          />

          <Field
            label="UHID"
            value={patient.uhid}
          />

          <Field
            label="Age"
            value={patient.age}
          />

          <Field
            label="Gender"
            value={patient.gender}
          />

          <Field
            label="Mobile"
            value={patient.mobile}
          />

          <Field
            label="Visit Type"
            value={visit.visitType}
          />

          <Field
            label="Doctor"
            value={doctor.name}
          />

          <Field
            label="Department"
            value={doctor.department}
          />
        </Grid>

        {/* IDs */}
        <Divider
          sx={{
            my: 1.75,
          }}
        />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={{
            xs: 0.5,
            sm: 2.5,
          }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            />
          }
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Patient ID{" "}
            <Typography
              component="span"
              variant="caption"
              fontWeight={700}
              color="text.primary"
            >
              {patient.patientId}
            </Typography>
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Visit ID{" "}
            <Typography
              component="span"
              variant="caption"
              fontWeight={700}
              color="text.primary"
            >
              {visit.visitId}
            </Typography>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
