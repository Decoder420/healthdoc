"use client";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import {
  Avatar,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

export interface PatientCardProps {
  patient: {
    uhid: string;
    name: string;
    age: number;
    gender: string;
    dob?: string;
    mobile?: string;
    address?: string;
  };

  doctor: {
    name: string;
    department?: string;
  };

  visit?: {
    type?: string;
    visitNo?: string;
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
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          flex: 1,
        }}
      >
        {value || "-"}
      </Typography>
    </Stack>
  );
}

export default function PatientCard({
  patient,
  doctor,
  visit,
}: PatientCardProps) {
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
          borderLeft: "6px solid",
          borderColor: "primary.main",
          bgcolor: "#F8FAFC",
        }}
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
            <PersonOutlineRoundedIcon />
          </Avatar>

          <Box>
            <Typography
              fontWeight={700}
              fontSize={18}
            >
              Patient Information
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Demographic & Visit Details
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box p={3}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Row
              label="UHID"
              value={patient.uhid}
            />

            <Row
              label="Patient Name"
              value={patient.name}
            />

            <Row
              label="Age / Gender"
              value={`${patient.age} Years / ${patient.gender}`}
            />

            <Row
              label="Date of Birth"
              value={patient.dob}
            />

            <Row
              label="Mobile"
              value={patient.mobile}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Row
              label="Visit Type"
              value={visit?.type}
            />

            <Row
              label="Visit No."
              value={visit?.visitNo}
            />

            <Row
              label="Referring Doctor"
              value={doctor.name}
            />

            <Row
              label="Department"
              value={doctor.department}
            />

            <Row
              label="Address"
              value={patient.address}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}