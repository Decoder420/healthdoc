"use client";

import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";

import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface ClinicalHistoryProps {
  clinicalHistory?: string;
}

export default function ClinicalHistory({
  clinicalHistory,
}: ClinicalHistoryProps) {
  const hasHistory = Boolean(clinicalHistory?.trim());

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "primary.main",
            }}
          >
            <MedicalInformationOutlinedIcon fontSize="small" />
          </Avatar>

          <Box>
            <Typography
              fontSize={16}
              fontWeight={700}
              lineHeight={1.3}
            >
              Clinical History
            </Typography>

            <Typography
              fontSize={12}
              color="text.secondary"
              lineHeight={1.4}
            >
              Clinical indication and patient history
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box px={2.5} py={2}>
        <Box
          sx={{
            position: "relative",
            px: 2,
            py: 1.75,
            borderRadius: 1.5,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "divider",
            borderLeft: "3px solid",
            borderLeftColor: "primary.main",
          }}
        >
          <Stack spacing={0.75}>
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Clinical Indication
            </Typography>

            <Typography
              sx={{
                fontSize: 13.5,
                lineHeight: 1.7,
                color: hasHistory
                  ? "text.primary"
                  : "text.secondary",
                whiteSpace: "pre-wrap",
              }}
            >
              {hasHistory
                ? clinicalHistory?.trim()
                : "No clinical history was provided for this examination."}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}
