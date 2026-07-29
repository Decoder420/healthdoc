"use client";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import {
  Avatar,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export interface FindingsProps {
  findings?: string;
}

export default function Findings({
  findings,
}: FindingsProps) {
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
              width: 46,
              height: 46,
            }}
          >
            <DescriptionOutlinedIcon />
          </Avatar>

          <Box>
            <Typography
              fontWeight={700}
              fontSize={18}
            >
              Findings
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Detailed radiological observations
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
            bgcolor: "#FAFBFC",
            borderStyle: "solid",
          }}
        >
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              textAlign: "justify",
              lineHeight: 1.9,
              fontSize: 14,
              color: "text.primary",
              minHeight: 140,
            }}
          >
            {findings?.trim() ||
              "No radiological findings available."}
          </Typography>
        </Paper>
      </Box>
    </Paper>
  );
}