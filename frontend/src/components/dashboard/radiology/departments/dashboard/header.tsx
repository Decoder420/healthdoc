"use client";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { DashboardHeaderProps } from "./types";

export default function DashboardHeader({
  title,
  subtitle,
  description,
  icon,
  actions,
  children,
}: DashboardHeaderProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "flex-start" }}
        spacing={3}
      >

        {/* Header Left */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
        >

          {icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "action.hover",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}


          <Stack spacing={0.5}>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {title}
            </Typography>


            {subtitle && (
              <Typography
                variant="subtitle1"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}


            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {description}
              </Typography>
            )}

          </Stack>

        </Stack>



        {/* Actions */}
        {actions && (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent={{
              xs: "flex-start",
              md: "flex-end",
            }}
          >
            {actions}
          </Stack>
        )}

      </Stack>



      {/* Extra Content */}
      {children && (
        <Box mt={3}>
          {children}
        </Box>
      )}

    </Paper>
  );
}