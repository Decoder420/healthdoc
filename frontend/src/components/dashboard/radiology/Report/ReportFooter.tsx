"use client";

import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface ReportFooterProps {
  generatedOn: string;
  hospital: {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

export default function ReportFooter({
  generatedOn,
  hospital,
}: ReportFooterProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        mt: 2,
      }}
    >
      <Divider />

      <Box p={2}>
        <Stack
          spacing={1}
          alignItems="center"
          textAlign="center"
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Generated On: <strong>{generatedOn}</strong>
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ maxWidth: 700 }}
          >
            This is a computer-generated radiology report and has been
            electronically verified by the reporting radiologist. No physical
            signature is required.
          </Typography>

          {(hospital.phone ||
            hospital.email ||
            hospital.website) && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {hospital.name}
              {hospital.phone && ` • ${hospital.phone}`}
              {hospital.email && ` • ${hospital.email}`}
              {hospital.website && ` • ${hospital.website}`}
            </Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}