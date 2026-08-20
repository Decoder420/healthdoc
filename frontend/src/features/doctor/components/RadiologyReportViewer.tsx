"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { meridian } from "@/styles/theme";
import type { RadiologyReport } from "../types";

const sectionLabelSx = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: meridian.textSecondary,
  mb: 0.75,
} as const;

export interface RadiologyReportViewerProps {
  report: RadiologyReport;
}

export function RadiologyReportViewer({ report }: RadiologyReportViewerProps) {
  return (
    <Stack spacing={2}>
      {report.status === "preliminary" && (
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: "12px",
            backgroundColor: "#fef3c7",
            border: "1px solid rgb(180 83 9 / 0.22)",
          }}
        >
          <Typography sx={{ fontSize: "0.8125rem", color: meridian.textPrimary }}>
            <strong>Preliminary report.</strong> Not yet finalised by the reporting consultant — a
            corrected version may follow.
          </Typography>
        </Box>
      )}

      <Box>
        <Typography sx={sectionLabelSx}>Findings</Typography>
        <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
          {report.findings}
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: "12px",
          border: `1px solid ${meridian.border}`,
          backgroundColor: meridian.muted,
        }}
      >
        <Typography sx={sectionLabelSx}>Impression</Typography>
        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.6 }}>
          {report.impression}
        </Typography>
      </Box>

      {report.pacs_study_uid && (
        <Box>
          <Typography sx={sectionLabelSx}>PACS study</Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: meridian.textSecondary,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              wordBreak: "break-all",
            }}
          >
            {report.pacs_study_uid}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
