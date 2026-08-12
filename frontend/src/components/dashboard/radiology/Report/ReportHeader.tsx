"use client";

import Image from "next/image";

import {
  Box,
  Divider,
  Stack,
  Typography,
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
      {/* Hospital Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
      >
        <Stack
          direction="row"
          spacing={1.75}
          alignItems="center"
        >
          {hospital.logo ? (
            <Box
              sx={{
                width: 64,
                height: 64,
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src={hospital.logo}
                alt="Hospital Logo"
                fill
                sizes="64px"
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: 64,
                height: 64,
                flexShrink: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                bgcolor: "grey.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.disabled",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              LOGO
            </Box>
          )}

          <Box>
            <Typography
              fontSize={20}
              fontWeight={800}
              lineHeight={1.25}
              color="text.primary"
            >
              {hospital.name}
            </Typography>

            <Typography
              fontSize={11.5}
              color="text.secondary"
              mt={0.5}
            >
              {hospital.address}
            </Typography>

            <Typography
              fontSize={11}
              color="text.secondary"
              mt={0.25}
            >
              {hospital.phone} • {hospital.email}
              {hospital.website
                ? ` • ${hospital.website}`
                : ""}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Report Metadata */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            fontSize={10.5}
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.4}
          >
            Report No.
          </Typography>

          <Typography
            fontSize={13}
            fontWeight={700}
            mt={0.25}
          >
            {report.reportNo}
          </Typography>
        </Box>

        <Box>
          <Typography
            fontSize={10.5}
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.4}
          >
            Accession No.
          </Typography>

          <Typography
            fontSize={13}
            fontWeight={700}
            mt={0.25}
          >
            {report.accessionNo}
          </Typography>
        </Box>

        <Box>
          <Typography
            fontSize={10.5}
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.4}
          >
            Study Date
          </Typography>

          <Typography
            fontSize={13}
            fontWeight={700}
            mt={0.25}
          >
            {report.studyDate}
          </Typography>
        </Box>

        <Box>
          <Typography
            fontSize={10.5}
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.4}
          >
            Report Date
          </Typography>

          <Typography
            fontSize={13}
            fontWeight={700}
            mt={0.25}
          >
            {report.reportDate}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}