"use client";

import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import {
  Avatar,
  Box,
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
  const hasImpression = Boolean(impression?.trim());

  const impressionItems =
    impression
      ?.trim()
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

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
              bgcolor: "success.main",
            }}
          >
            <FactCheckOutlinedIcon fontSize="small" />
          </Avatar>

          <Box>
            <Typography
              fontSize={16}
              fontWeight={700}
              lineHeight={1.3}
            >
              Impression
            </Typography>

            <Typography
              fontSize={12}
              color="text.secondary"
              lineHeight={1.4}
            >
              Radiologist's diagnostic conclusion
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box
        px={2.5}
        py={2}
        sx={{
          borderLeft: "4px solid",
          borderLeftColor: "success.main",
          bgcolor: "success.50",
        }}
      >
        {hasImpression ? (
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 2.5,
              color: "text.primary",
              "& li::marker": {
                color: "success.main",
              },
            }}
          >
            {impressionItems.map((item, index) => (
              <Box
                component="li"
                key={`${item}-${index}`}
                sx={{
                  pl: 0.5,
                  mb:
                    index === impressionItems.length - 1
                      ? 0
                      : 0.5,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontWeight: 600,
                  }}
                >
                  {item.replace(/^[-•*]\s*/, "")}
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
            No diagnostic impression available.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
