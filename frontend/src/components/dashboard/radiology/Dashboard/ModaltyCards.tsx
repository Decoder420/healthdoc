"use client";

import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { modalityCards } from "./dummyData";

export default function ModalityCards() {
  return (
    <>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
      >
        Modality Performance
      </Typography>

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
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 8px 20px rgba(0, 0, 0, 0.07)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2,
                    "&:last-child": {
                      pb: 2,
                    },
                  }}
                >
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
                          bgcolor: "#F4F7FC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          "& svg": {
                            fontSize: 22,
                            color: "#001F54",
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
                      bgcolor: "#EEF2F7",

                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#001F54",
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
