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
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

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

  if (!reports.length) {
    return (
      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ py: 8 }}>
          <Stack alignItems="center" spacing={2}>
            <DescriptionRoundedIcon
              sx={{
                fontSize: 70,
                color: "text.secondary",
              }}
            />

            <Typography variant="h6">
              No Reports Available
            </Typography>

            <Typography color="text.secondary">
              This patient has no verified laboratory reports.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

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
          Laboratory Reports
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          {reports.map((report) => (
            <Card
              key={report.reportId}
              variant="outlined"
              sx={{
                borderRadius: 3,
                transition: ".25s",

                "&:hover": {
                  boxShadow: 4,
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

                  {/* Left */}

                  <Box>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mb={1}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {report.reportId}
                      </Typography>

                      <Chip
                        icon={<VerifiedRoundedIcon />}
                        color="success"
                        label={report.status}
                        size="small"
                      />
                    </Stack>

                    <Typography color="text.secondary">
                      Visit ID : {report.visitId}
                    </Typography>

                    <Typography color="text.secondary">
                      {report.testCount} Tests
                    </Typography>

                    <Typography color="text.secondary">
                      Verified By : {report.verifiedBy}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      <CalendarMonthRoundedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          verticalAlign: "middle",
                        }}
                      />

                      {new Date(
                        report.verifiedDate
                      ).toLocaleString()}
                    </Typography>

                  </Box>

                  {/* Actions */}

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1}
                    alignItems={{
                      xs: "stretch",
                      md: "center",
                    }}
                  >

                    <Button
                      variant="contained"
                      startIcon={
                        <VisibilityRoundedIcon />
                      }
                      onClick={() =>
                        router.push(
                          `/dashboard/pathology/report/${report.reportId}`
                        )
                      }
                    >
                      View
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={
                        <DownloadRoundedIcon />
                      }
                    >
                      Download
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={
                        <PrintRoundedIcon />
                      }
                    >
                      Print
                    </Button>

                  </Stack>

                </Stack>

              </CardContent>
            </Card>
          ))}
        </Stack>

      </CardContent>
    </Card>
  );
}