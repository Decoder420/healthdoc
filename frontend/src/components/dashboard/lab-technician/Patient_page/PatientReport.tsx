"use client";

import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

interface Report {
  reportId: string;
  visitId: string;
  testCount: number;
  verifiedBy: string;
  verifiedDate: string;
  status: string;
}

interface Props {
  reports: Report[];
}

export default function PatientReports({
  reports,
}: Props) {
  const router = useRouter();

  /*
   * ============================
   * EMPTY STATE
   * ============================
   */

  if (!reports.length) {
    return (
      <Card
        elevation={0}
        className="surface-card"
      >
        <CardContent
          sx={{
            py: 6,
            px: 3,
          }}
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            textAlign="center"
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "action.hover",
                color: "text.secondary",
              }}
            >
              <DescriptionRoundedIcon />
            </Box>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No Reports Available
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              This patient has no verified laboratory reports.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  /*
   * ============================
   * REPORTS
   * ============================
   */

  return (
    <Card
      elevation={0}
      className="surface-card"
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
          spacing={1.2}
          mb={2}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <DescriptionRoundedIcon
              sx={{
                fontSize: 19,
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              lineHeight={1.2}
            >
              Laboratory Reports
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Verified reports for this patient
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* ================= REPORT LIST ================= */}

        <Stack spacing={1.25}>
          {reports.map((report) => (
            <Card
              key={report.reportId}
              variant="outlined"
              elevation={0}
              sx={{
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
                    xs: 1.75,
                    md: 2,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.75,
                      md: 2,
                    },
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "stretch",
                    md: "center",
                  }}
                >
                  {/* ================= REPORT INFO ================= */}

                  <Stack
                    spacing={1}
                    minWidth={0}
                  >
                    {/* Report ID + Status */}

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Typography
                        fontWeight={700}
                        fontSize="0.95rem"
                      >
                        {report.reportId}
                      </Typography>

                      <Chip
                        icon={
                          <VerifiedRoundedIcon
                            sx={{
                              fontSize: 15,
                            }}
                          />
                        }
                        label={report.status}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{
                          height: 24,
                          fontWeight: 600,

                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    </Stack>

                    {/* ================= META ================= */}

                    <Stack
                      direction="row"
                      spacing={{
                        xs: 1.5,
                        md: 2,
                      }}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <MetaItem
                        icon={
                          <EventNoteRoundedIcon />
                        }
                        label="Visit"
                        value={report.visitId}
                      />

                      <MetaItem
                        icon={
                          <DescriptionRoundedIcon />
                        }
                        label="Tests"
                        value={`${report.testCount}`}
                      />

                      <MetaItem
                        icon={
                          <VerifiedRoundedIcon />
                        }
                        label="Verified By"
                        value={report.verifiedBy}
                      />

                      <MetaItem
                        icon={
                          <CalendarMonthRoundedIcon />
                        }
                        label="Verified"
                        value={formatDate(
                          report.verifiedDate
                        )}
                      />
                    </Stack>
                  </Stack>

                  {/* ================= VIEW BUTTON ================= */}

                  <Box
                    sx={{
                      flexShrink: 0,
                      alignSelf: {
                        xs: "flex-start",
                        md: "center",
                      },
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={
                        <VisibilityRoundedIcon />
                      }
                      onClick={() =>
                        router.push(
                          `/lab/reports/${report.reportId}`
                        )
                      }
                      sx={{
                        minWidth: 125,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",

                        "&:hover": {
                          boxShadow: "none",
                        },
                      }}
                    >
                      View Report
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

/*
 * ============================
 * META ITEM
 * ============================
 */

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.6}
      alignItems="center"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.secondary",

          "& svg": {
            fontSize: 16,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}:
      </Typography>

      <Typography
        variant="caption"
        fontWeight={600}
        color="text.primary"
        noWrap
      >
        {value}
      </Typography>
    </Stack>
  );
}

/*
 * ============================
 * DATE FORMAT
 * ============================
 */

function formatDate(value: string) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}