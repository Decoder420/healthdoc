"use client";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import {
  Avatar,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface ImpressionProps {
  impression?: string;
}

export default function Impression({
  impression,
}: ImpressionProps) {
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
          borderColor: "success.main",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Avatar
            sx={{
              bgcolor: "success.main",
              width: 46,
              height: 46,
            }}
          >
            <FactCheckOutlinedIcon />
          </Avatar>

          <Box>
            <Typography
              fontSize={18}
              fontWeight={700}
            >
              Impression
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Radiologist's Diagnostic Conclusion
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Content */}
      <Box p={3}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,

            bgcolor: "#F6FFF8",

            borderColor: "success.light",

            borderLeft: "5px solid",

            borderLeftColor: "success.main",
          }}
        >
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.9,
              fontSize: 15,
              fontWeight: 600,
              color: "text.primary",
              minHeight: 70,
            }}
          >
            {impression?.trim() ||
              "No diagnostic impression available."}
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}