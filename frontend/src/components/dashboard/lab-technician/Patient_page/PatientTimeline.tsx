"use client";

import { useRouter } from "next/navigation";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

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
  const router = useRouter();

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Visit Timeline
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          {[...visits]
            .sort(
              (a, b) =>
                new Date(b.order.orderedAt).getTime() -
                new Date(a.order.orderedAt).getTime()
            )
            .map((visit, index) => (
              <Stack
                key={visit.visit.visitId}
                direction="row"
                spacing={3}
                alignItems="stretch"
              >
                {/* Timeline */}

                <Stack
                  alignItems="center"
                  sx={{ width: 40 }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  {index !== visits.length - 1 && (
                    <Box
                      sx={{
                        flex: 1,
                        width: 2,
                        bgcolor: "divider",
                        mt: 1,
                      }}
                    />
                  )}
                </Stack>

                {/* Visit Card */}

                <Card
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    transition: ".25s",

                    "&:hover": {
                      boxShadow: 5,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction={{
                        xs: "column",
                        md: "row",
                      }}
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Box flex={1}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mb={2}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Typography
                            variant="h6"
                            fontWeight={700}
                          >
                            {visit.visit.visitId}
                          </Typography>

                          <Chip
                            size="small"
                            label={visit.visit.visitType}
                          />

                          <Chip
                            size="small"
                            color={getStatusColor(
                              visit.status
                            )}
                            label={visit.status}
                          />
                        </Stack>

                        <Typography fontWeight={600}>
                          {visit.doctor.name}
                        </Typography>

                        <Typography color="text.secondary">
                          {visit.doctor.department}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mt={2}
                        >
                          <CalendarMonthRoundedIcon
                            fontSize="small"
                            color="action"
                          />

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {formatDateTime(
                              visit.order.orderedAt
                            )}
                          </Typography>
                        </Stack>
                      </Box>

                      <Stack
                        spacing={2}
                        alignItems={{
                          xs: "flex-start",
                          md: "flex-end",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {visit.requestedTests.map(
                            (test) => (
                              <Chip
                                key={test}
                                label={test}
                                variant="outlined"
                                size="small"
                              />
                            )
                          )}
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Priority :
                          <strong>
                            {" "}
                            {visit.order.priority}
                          </strong>
                        </Typography>

                        <Button
                          variant="contained"
                          startIcon={
                            <VisibilityRoundedIcon />
                          }
                          onClick={() =>
                            router.push(
                              `/dashboard/pathology/visit/${visit.visit.visitId}`
                            )
                          }
                        >
                          View Visit
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            ))}
        </Stack>
      </CardContent>
    </Card>
  );
}