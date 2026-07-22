"use client";

import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Doctor, Patient, Visit } from "./types";

interface Props {
  patient: Patient;
  doctor: Doctor;
  visit: Visit;
}

interface FieldProps {
  label: string;
  value?: string | number;
}

function Field({ label, value }: FieldProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Stack spacing={0.5}>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={600}
        >
          {value || "--"}
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
    <Card
      sx={{
        mt: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Patient Information
        </Typography>

        <Grid container spacing={3}>
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

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Patient ID: <strong>{patient.patientId}</strong> • Visit ID:{" "}
          <strong>{visit.visitId}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
}