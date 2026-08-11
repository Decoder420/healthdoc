"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  ChipProps,
} from "@mui/material";

import Barcode from "react-barcode";

import { LabPatientOrder } from "@/lib/mock/lab_data";

interface Props {
  sample: LabPatientOrder["sample"];
  status: LabPatientOrder["status"];
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mb: 0.25,
          fontSize: "0.72rem",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
        sx={{
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || "--"}
      </Typography>
    </Box>
  );
}

const statusColor = (
  status: string
): ChipProps["color"] => {
  switch (status) {
    case "COLLECTED":
      return "success";

    case "QUEUE":
      return "warning";

    case "REJECTED":
      return "error";

    case "PROCESSING":
      return "info";

    case "VERIFIED":
    case "COMPLETED":
      return "success";

    default:
      return "default";
  }
};

export default function SampleInfoCard({
  sample,
  status,
}: Props) {
  return (
    <Card
      elevation={0}
      className="surface-card"
      sx={{
        mt: 2,
        overflow: "hidden",
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
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 1.75,
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                lineHeight: 1.3,
              }}
            >
              Sample Information
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Sample collection and identification details
            </Typography>
          </Box>

          <Chip
            label={status}
            color={statusColor(status)}
            size="small"
            sx={{
              height: 26,
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        </Stack>

        {/* Main Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 220px",
            },
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Sample Details */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              columnGap: 2.5,
              rowGap: 1.5,
              alignContent: "center",
            }}
          >
            <InfoItem
              label="Sample ID"
              value={sample.sampleId}
            />

            <InfoItem
              label="Barcode"
              value={sample.barcode}
            />

            <InfoItem
              label="Sample Type"
              value={sample.sampleType}
            />

            <InfoItem
              label="Container"
              value={sample.container}
            />

            <InfoItem
              label="Collected At"
              value={
                sample.collectedAt
                  ? new Date(
                      sample.collectedAt
                    ).toLocaleString()
                  : "--"
              }
            />

            <InfoItem
              label="Collected By"
              value={sample.collectedBy}
            />
          </Box>

          {/* Barcode */}
          <Stack
            spacing={0.75}
            alignItems="center"
            justifyContent="center"
            sx={{
              minHeight: 90,
              overflow: "hidden",
            }}
          >
            {sample.barcode ? (
              <>
                <Barcode
                  value={sample.barcode}
                  width={1.5}
                  height={42}
                  displayValue={false}
                  margin={0}
                />

                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{
                    fontFamily:
                      "var(--font-ibm-plex-mono), monospace",
                    letterSpacing: "0.04em",
                    fontSize: "0.7rem",
                  }}
                >
                  {sample.barcode}
                </Typography>
              </>
            ) : (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                No barcode available
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );
}