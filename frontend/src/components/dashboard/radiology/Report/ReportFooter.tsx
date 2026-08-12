"use client";

import {
  Box,
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
  const contactDetails = [
    hospital.phone,
    hospital.email,
    hospital.website,
  ].filter(Boolean);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        px: 2.5,
        py: 1.75,
        borderTop: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        bgcolor: "grey.50",
      }}
    >
      <Stack
        spacing={0.75}
        alignItems="center"
        textAlign="center"
      >
        <Typography
          fontSize={13}
          fontWeight={700}
          color="text.primary"
        >
          {hospital.name}
        </Typography>

        {contactDetails.length > 0 && (
          <Typography
            fontSize={11}
            color="text.secondary"
          >
            {contactDetails.join(" • ")}
          </Typography>
        )}

        <Box
          sx={{
            width: "100%",
            maxWidth: 700,
            my: 0.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />

        <Typography
          fontSize={11}
          color="text.secondary"
        >
          Generated On:{" "}
          <Box
            component="span"
            fontWeight={600}
            color="text.primary"
          >
            {generatedOn}
          </Box>
        </Typography>

        <Typography
          fontSize={10.5}
          color="text.secondary"
          sx={{
            maxWidth: 750,
            lineHeight: 1.5,
          }}
        >
          This is a computer-generated radiology report and has been
          electronically verified by the reporting radiologist. No physical
          signature is required.
        </Typography>
      </Stack>
    </Paper>
  );
}
