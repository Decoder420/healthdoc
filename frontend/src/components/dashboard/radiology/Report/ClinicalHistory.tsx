"use client";

import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";

import {
  Avatar,
  Box,
  Divider,
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
          bgcolor: "#F8FAFC",
          borderLeft: "6px solid",
          borderColor: "primary.main",
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
            <MedicalInformationOutlinedIcon />
          </Avatar>

          <Box>
            <Typography
              fontWeight={700}
              fontSize={18}
            >
              Clinical History
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Clinical indication and patient history
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Content */}
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: "#FAFBFC",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              textAlign: "justify",
              lineHeight: 1.9,
              fontSize: 14,
              color: "text.primary",
              minHeight: 100,
            }}
          >
            {clinicalHistory?.trim() ||
              "No clinical history was provided for this examination."}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}