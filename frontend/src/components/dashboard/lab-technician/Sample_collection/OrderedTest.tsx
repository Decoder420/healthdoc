"use client";

import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

import { Patient } from "./PatientSearch";

interface OrderedTestsProps {
  patient: Patient | null;
}

export default function OrderedTests({
  patient,
}: OrderedTestsProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
      >
        Ordered Tests
      </Typography>

      {!patient ? (
        <Typography color="text.secondary">
          Select a patient to view ordered tests.
        </Typography>
      ) : patient.tests.length === 0 ? (
        <Typography color="text.secondary">
          No tests ordered.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {patient.tests.map((test) => (
            <Chip
              key={test}
              icon={<ScienceRoundedIcon />}
              label={test}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}