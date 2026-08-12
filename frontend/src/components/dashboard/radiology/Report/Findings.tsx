"use client";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import {
  Avatar,
  Box,
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
  const findingItems =
    findings
      ?.trim()
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const hasFindings = findingItems.length > 0;

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
            <DescriptionOutlinedIcon fontSize="small" />
          </Avatar>

          <Box>
            <Typography
              fontSize={16}
              fontWeight={700}
              lineHeight={1.3}
            >
              Findings
            </Typography>

            <Typography
              fontSize={12}
              color="text.secondary"
              lineHeight={1.4}
            >
              Detailed radiological observations
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box px={2.5} py={2}>
        {hasFindings ? (
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 2.5,
              color: "text.primary",
            }}
          >
            {findingItems.map((finding, index) => (
              <Box
                component="li"
                key={`${finding}-${index}`}
                sx={{
                  pl: 0.75,
                  mb:
                    index === findingItems.length - 1
                      ? 0
                      : 0.75,
                  "&::marker": {
                    color: "primary.main",
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: 13.5,
                    lineHeight: 1.7,
                  }}
                >
                  {finding.replace(/^[-•*]\s*/, "")}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: "text.secondary",
            }}
          >
            No radiological findings available.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
