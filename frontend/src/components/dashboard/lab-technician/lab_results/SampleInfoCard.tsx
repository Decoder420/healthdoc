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

import { Sample } from "./types";

interface Props {
  sample: Sample;
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <Box
      sx={{
        minWidth: 170,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        fontWeight={600}
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
    case "Collected":
      return "success";

    case "Pending":
      return "warning";

    case "Rejected":
      return "error";

    case "Processing":
      return "info";

    default:
      return "default";
  }
};

export default function SampleInfoCard({
  sample,
}: Props) {
  return (
    <Card
      sx={{
        mt:3,
        borderRadius: 3,
      }}
    >
      <CardContent>
  <Typography
    variant="h6"
    fontWeight={700}
    gutterBottom
  >
    Sample Information
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        lg: "1fr auto",
      },
      
      alignItems: "center",
    }}
  >
    {/* Left Section */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 3,
      }}
    >
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
        value={sample.collectedAt}
      />
    </Box>

    {/* Right Section */}
    <Stack
      spacing={1.5}
      alignItems="center"
      justifyContent="center"
      sx={{
        minWidth: 220,
      }}
    >
      <Chip
        label={sample.status}
        color={statusColor(sample.status)}
        size="small"
      />

      <Barcode
        value={sample.barcode}
        width={1.6}
        height={45}
        displayValue={false}
        margin={0}
      />

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {sample.barcode}
      </Typography>
    </Stack>
  </Box>

  <Divider sx={{ mt: 3 }} />
</CardContent>
    </Card>
  );
}