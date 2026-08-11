"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

import { formatDateTime } from "@/lib/format-datetime";

interface Visit {
  status: string;

  visit: {
    visitId: string;
    visitType: string;
  };

  doctor: {
    name: string;
    department: string;
  };

  order: {
    orderedAt: string;
    priority: string;
  };

  requestedTests: string[];
}

interface Props {
  visits: Visit[];
  getStatusColor: (status: string) => any;
}

export default function PatientTimeline({
  visits,
  getStatusColor,
}: Props) {
  const sortedVisits = [...visits].sort(
    (a, b) =>
      new Date(b.order.orderedAt).getTime() -
      new Date(a.order.orderedAt).getTime()
  );

  return (
    <Card
      elevation={0}
      className="surface-card"
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.5 },
          "&:last-child": {
            pb: { xs: 2, md: 2.5 },
          },
        }}
      >
        {/* ================= HEADER ================= */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          mb={2}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarMonthRoundedIcon
              sx={{ fontSize: 19 }}
            />
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              lineHeight={1.2}
            >
              Visit Timeline
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Patient visit history
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* ================= TIMELINE ================= */}

        <Stack spacing={1.5}>
          {sortedVisits.map((visit, index) => {
            const isLast =
              index === sortedVisits.length - 1;

            return (
              <Stack
                key={visit.visit.visitId}
                direction="row"
                spacing={{
                  xs: 1.5,
                  md: 2,
                }}
                
                alignItems="stretch"
              >
                {/* ================= TIMELINE INDICATOR ================= */}

                <Stack
                  alignItems="center"
                  sx={{
                    width: {
                      xs: 30,
                      md: 34,
                    },
                    flexShrink: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: {
                        xs: 30,
                        md: 34,
                      },
                      height: {
                        xs: 30,
                        md: 34,
                      },
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  {!isLast && (
                    <Box
                      sx={{
                        width: 1.5,
                        flex: 1,
                        bgcolor: "divider",
                        mt: 0.75,
                        minHeight: 20,
                      }}
                    />
                  )}
                </Stack>

                {/* ================= VISIT CARD ================= */}

                <Card
                  variant="outlined"
                  elevation={0}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    transition:
                      "border-color 0.2s ease, box-shadow 0.2s ease",

                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: 1,
                    },
                  }}
                  className="surface-card"
                >
                  <CardContent
                    sx={{
                      p: {
                        xs: 1.5,
                        md: 1.75,
                      },

                      "&:last-child": {
                        pb: {
                          xs: 1.5,
                          md: 1.75,
                        },
                      },
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        md: "row",
                      }}
                      spacing={{
                        xs: 1.5,
                        md: 2,
                      }}
                      justifyContent="space-between"
                    >
                      {/* ================= LEFT INFORMATION ================= */}

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        {/* Visit Header */}

                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                          mb={0.75}
                        >
                          <Typography
                            fontWeight={700}
                            fontSize="0.95rem"
                          >
                            {visit.visit.visitId}
                          </Typography>

                          <Chip
                            label={visit.visit.visitType}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 23,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          />

                          <Chip
                            label={visit.status}
                            size="small"
                            color={getStatusColor(
                              visit.status
                            )}
                            sx={{
                              height: 23,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>

                        {/* Doctor */}

                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          mb={0.75}
                        >
                          <MedicalServicesRoundedIcon
                            sx={{
                              fontSize: 16,
                              color: "text.secondary",
                            }}
                          />

                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {visit.doctor.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            • {visit.doctor.department}
                          </Typography>
                        </Stack>

                        {/* Date */}

                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                        >
                          <CalendarMonthRoundedIcon
                            sx={{
                              fontSize: 15,
                              color: "text.secondary",
                            }}
                          />

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDateTime(
                              visit.order.orderedAt
                            )}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* ================= RIGHT INFORMATION ================= */}

                      <Stack
                        spacing={1}
                        alignItems={{
                          xs: "flex-start",
                          md: "flex-end",
                        }}
                        justifyContent="center"
                        sx={{
                          minWidth: {
                            md: 220,
                          },
                        }}
                      >
                        {/* Tests */}

                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          useFlexGap
                          justifyContent={{
                            xs: "flex-start",
                            md: "flex-end",
                          }}
                        >
                          {visit.requestedTests
                            .slice(0, 4)
                            .map((test) => (
                              <Chip
                                key={test}
                                label={test}
                                variant="outlined"
                                size="small"
                                sx={{
                                  height: 23,
                                  fontSize: "0.68rem",
                                }}
                              />
                            ))}

                          {visit.requestedTests.length >
                            4 && (
                            <Chip
                              label={`+${
                                visit.requestedTests
                                  .length - 4
                              } more`}
                              size="small"
                              sx={{
                                height: 23,
                                fontSize: "0.68rem",
                                bgcolor: "action.hover",
                              }}
                            />
                          )}
                        </Stack>

                        {/* Priority */}

                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Priority
                          </Typography>

                          <Typography
                            variant="caption"
                            fontWeight={700}
                          >
                            {visit.order.priority}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            );
          })}
        </Stack>

        {/* ================= EMPTY STATE ================= */}

        {sortedVisits.length === 0 && (
          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No visit history available.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
