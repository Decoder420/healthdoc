"use client";

import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { modalityCards } from "./dummyData";

export default function ModalityCards() {
  return (
    <>
      <h2 className="text-lg font-semibold text-foreground mb-4">
  Modality Performance
</h2>

      <Grid container spacing={2}>
        {modalityCards.map((item) => {
          const progress =
            item.total === 0
              ? 0
              : Math.round(
                  (item.completed / item.total) * 100
                );

          return (
            <Grid
              key={item.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 2,
              }}
            >
              <div className="surface-card h-full p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                {/* Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1.5}
                >
                  <Typography
                    fontWeight={700}
                    fontSize={16}
                  >
                    {item.modality}
                  </Typography>

                  {item.icon && (
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        "& svg": {
                          fontSize: 21,
                          color: "primary.contrastText",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                  )}
                </Stack>

                {/* Total */}
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={1}
                  mb={1}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary"
                    lineHeight={1}
                  >
                    {item.total}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Total Studies
                  </Typography>
                </Stack>

                {/* Completed / Pending */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  mb={1.25}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Completed{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      fontWeight={700}
                      color="text.primary"
                    >
                      {item.completed}
                    </Typography>
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Pending{" "}
                    <Typography
                      component="span"
                      variant="caption"
                      fontWeight={700}
                      color="text.primary"
                    >
                      {item.pending}
                    </Typography>
                  </Typography>
                </Stack>

                {/* Progress */}
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 10,
                    bgcolor: "action.hover",

                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "primary.main",
                      borderRadius: 10,
                    },
                  }}
                />

                {/* Footer */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={0.75}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {progress}% Complete
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Avg {item.averageTime}
                  </Typography>
                </Stack>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}