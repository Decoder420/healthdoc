"use client";

import { useRouter } from "next/navigation";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  Card,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { VerifiedReportData } from "./types";

interface Props {
  reports: VerifiedReportData[];
}

export default function VerifiedReportsTable({
  reports,
}: Props) {
  const router = useRouter();

  const handleOpenReport = (report: VerifiedReportData) => {
    router.push(`/lab/reports/${report.report.reportNo}`);
  };

  const verifiedReports = reports.filter(
    (report) => report.report.status === "VERIFIED"
  );

  return (
    <Card
      elevation={0}
      className="surface-card"
      sx={{
        mt: 2,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              borderColor: "divider",
              textAlign: "center",
              verticalAlign: "middle",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Report No.
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Patient
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                UHID
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Test
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Barcode
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Verified By
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Verified Date
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                Status
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: "action.hover",
                }}
              >
                PDF
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {verifiedReports.length > 0 ? (
              verifiedReports.map((item) => (
                <TableRow
                  hover
                  key={item.report.reportNo}
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  {/* REPORT NO. */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {item.report.reportNo}
                    </Typography>
                  </TableCell>

                  {/* PATIENT */}
                  <TableCell>
                    <Stack
                      spacing={0.25}
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {item.patient.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.patient.age} Years •{" "}
                        {item.patient.gender}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* UHID */}
                  <TableCell>
                    <Typography variant="body2">
                      {item.patient.uhid}
                    </Typography>
                  </TableCell>

                  {/* TEST */}
                  <TableCell>
                    <Typography variant="body2">
                      {item.report.testName}
                    </Typography>
                  </TableCell>

                  {/* BARCODE */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.sample.barcode}
                    </Typography>
                  </TableCell>

                  {/* VERIFIED BY */}
                  <TableCell>
                    <Typography variant="body2">
                      {item.report.verifiedBy}
                    </Typography>
                  </TableCell>

                  {/* VERIFIED DATE */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.report.verifiedDate}
                    </Typography>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Chip
                      label={item.report.status}
                      color="success"
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* PDF */}
                  <TableCell align="center">
                    <Tooltip title="Open Report PDF">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleOpenReport(item)
                        }
                        sx={{
                          width: 32,
                          height: 32,
                        }}
                      >
                        <PictureAsPdfIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{
                    py: 6,
                    borderBottom: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    No verified reports found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}