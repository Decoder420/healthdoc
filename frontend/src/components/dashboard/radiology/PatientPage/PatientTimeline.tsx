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
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import type {
  RadiologyQueueItem,
} from "@/components/dashboard/radiology/test_queue/DummyData";

interface Props {
  studies: RadiologyQueueItem[];
}

export default function PatientTimeline({
  studies,
}: Props) {
  /*
   * ==========================================
   * SORT STUDIES
   * ==========================================
   *
   * Latest study appears first.
   */

  const sortedStudies = [...studies].sort(
    (a, b) =>
      new Date(
        `${b.appointmentDate} ${b.appointmentTime}`
      ).getTime() -
      new Date(
        `${a.appointmentDate} ${a.appointmentTime}`
      ).getTime()
  );

  /*
   * ==========================================
   * STATUS COLOR
   * ==========================================
   */

  const getStatusColor = (
    status: RadiologyQueueItem["status"]
  ):
    | "success"
    | "warning"
    | "info"
    | "error"
    | "default" => {
    switch (status) {
      case "Verified":
        return "success";

      case "Processing":
        return "warning";

      case "Queue":
        return "info";

      case "No Show":
        return "error";

      case "Removed":
        return "default";

      default:
        return "default";
    }
  };

  /*
   * ==========================================
   * PRIORITY COLOR
   * ==========================================
   */

  const getPriorityColor = (
    priority: RadiologyQueueItem["priority"]
  ):
    | "error"
    | "warning"
    | "default" => {
    switch (priority) {
      case "Emergency":
        return "error";

      case "Urgent":
        return "warning";

      case "Routine":
      default:
        return "default";
    }
  };

  /*
   * ==========================================
   * REPORT COLOR
   * ==========================================
   */

  const getReportColor = (
    status: RadiologyQueueItem["reportStatus"]
  ):
    | "success"
    | "warning"
    | "default" => {
    switch (status) {
      case "Verified":
        return "success";

      case "Draft":
        return "warning";

      default:
        return "default";
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            md: 2.5,
          },

          "&:last-child": {
            pb: {
              xs: 2,
              md: 2.5,
            },
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
            <LocalHospitalRoundedIcon
              sx={{ fontSize: 19 }}
            />
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              lineHeight={1.2}
            >
              Radiology Timeline
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Patient imaging history
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* ================= TIMELINE ================= */}

        <Stack spacing={1.5}>
          {sortedStudies.map((study, index) => {
            const isLast =
              index === sortedStudies.length - 1;

            return (
              <Stack
                key={study.orderId}
                direction="row"
                spacing={{
                  xs: 1.5,
                  md: 2,
                }}
                alignItems="stretch"
              >
                {/* ================= TIMELINE MARKER ================= */}

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

                {/* ================= STUDY CARD ================= */}

                <Card
                  variant="outlined"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    borderRadius: 2.5,
                    borderColor: "divider",
                    transition:
                      "border-color 0.2s ease, box-shadow 0.2s ease",

                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: 1,
                    },
                  }}
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
                      {/* ================= MAIN INFORMATION ================= */}

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        {/* Study Header */}

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
                            {study.accessionNumber}
                          </Typography>

                          <Chip
                            label={study.modality}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 23,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          />

                          <Chip
                            label={study.status}
                            size="small"
                            color={getStatusColor(
                              study.status
                            )}
                            sx={{
                              height: 23,
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>

                        {/* Procedure */}

                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.75,
                          }}
                        >
                          {study.procedure}
                        </Typography>

                        {/* Radiologist */}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Radiologist:{" "}
                          <Typography
                            component="span"
                            variant="caption"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {study.radiologist}
                          </Typography>
                        </Typography>

                        {/* Date */}

                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          mt={0.75}
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
                            {formatRadiologyDate(
                              study.appointmentDate,
                              study.appointmentTime
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
                            md: 200,
                          },
                        }}
                      >
                        {/* Priority */}

                        <Chip
                          label={`${study.priority} Priority`}
                          size="small"
                          color={getPriorityColor(
                            study.priority
                          )}
                          variant={
                            study.priority ===
                            "Routine"
                              ? "outlined"
                              : "filled"
                          }
                          sx={{
                            height: 23,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        />

                        {/* Report */}

                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                        >
                          <DescriptionRoundedIcon
                            sx={{
                              fontSize: 16,
                              color: "text.secondary",
                            }}
                          />

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Report
                          </Typography>

                          <Chip
                            label={
                              study.reportStatus
                            }
                            size="small"
                            color={getReportColor(
                              study.reportStatus
                            )}
                            variant="outlined"
                            sx={{
                              height: 22,
                              fontSize: "0.68rem",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>

                        {/* Images */}

                        {study.imageCount > 0 && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {study.imageCount} images
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            );
          })}
        </Stack>

        {/* ================= EMPTY STATE ================= */}

        {sortedStudies.length === 0 && (
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
              No radiology history available.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* ==========================================
   DATE FORMAT
   ========================================== */

function formatRadiologyDate(
  date: string,
  time: string
) {
  const value = new Date(
    `${date} ${time}`
  );

  if (Number.isNaN(value.getTime())) {
    return `${date} • ${time}`;
  }

  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}