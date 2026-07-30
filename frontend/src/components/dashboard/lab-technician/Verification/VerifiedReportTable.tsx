"use client";

import { useRouter } from "next/navigation";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  Chip,
  IconButton,
  Paper,
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

  const handleOpenReport = (
    report: VerifiedReportData
  ) => {
    router.push(
      `/lab/reports/${report.report.reportNo}`
    );
  };

  // Show only verified reports
  const verifiedReports = reports.filter(
    (report) =>
      report.report.status === "VERIFIED"
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Report No.</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>UHID</TableCell>
            <TableCell>Test</TableCell>
            <TableCell>Barcode</TableCell>
            <TableCell>Verified By</TableCell>
            <TableCell>Verified Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">
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
              >
                <TableCell>
                  {item.report.reportNo}
                </TableCell>

                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={600}>
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

                <TableCell>
                  {item.patient.uhid}
                </TableCell>

                <TableCell>
                  {item.report.testName}
                </TableCell>

                <TableCell>
                  {item.sample.barcode}
                </TableCell>

                <TableCell>
                  {item.report.verifiedBy}
                </TableCell>

                <TableCell>
                  {item.report.verifiedDate}
                </TableCell>

                <TableCell>
                  <Chip
                    label={item.report.status}
                    color="success"
                    size="small"
                  />
                </TableCell>

                <TableCell align="center">
                  <Tooltip title="Open Report PDF">
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleOpenReport(item)
                      }
                    >
                      <PictureAsPdfIcon />
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
                sx={{ py: 6 }}
              >
                <Typography color="text.secondary">
                  No verified reports found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}