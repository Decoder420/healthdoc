"use client";

import Image from "next/image";
import {
  Box,
  Divider,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

export interface ReportHeaderProps {
  hospital: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };

  report: {
    reportNo: string;
    accessionNo: string;
    status: string;
    studyDate: string;
    reportDate: string;
  };
}

export default function ReportHeader({
  hospital,
  report,
}: ReportHeaderProps) {
  return (
    <Box>
      {/* Hospital Information */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {hospital.logo ? (
            <Image
              src={hospital.logo}
              alt="Hospital Logo"
              width={70}
              height={70}
            />
          ) : (
            <Box
              sx={{
                width: 70,
                height: 70,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100",
              }}
            >
              Logo
            </Box>
          )}

          <Box>
            <Typography variant="h5" fontWeight={700}>
              {hospital.name}
            </Typography>

            <Typography variant="body2">
              {hospital.address}
            </Typography>

            <Typography variant="body2">
              Phone: {hospital.phone}
            </Typography>

            <Typography variant="body2">
              Email: {hospital.email}
            </Typography>

            {hospital.website && (
              <Typography variant="body2">
                {hospital.website}
              </Typography>
            )}
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Report Details */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2,1fr)",
          },
          gap: 2,
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="body2">
            <strong>Report No:</strong> {report.reportNo}
          </Typography>

          <Typography variant="body2">
            <strong>Accession No:</strong> {report.accessionNo}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="body2">
            <strong>Study Date:</strong> {report.studyDate}
          </Typography>

          <Typography variant="body2">
            <strong>Report Date:</strong> {report.reportDate}
          </Typography>
        </Stack>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}