"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

interface SampleData {
  id: number;
  patientName: string;
  uhid: string;
  tests: string;
  barcode: string;
  collectedAt: string;
  status: "COLLECTED" | "PROCESSING";
  sampleType: string;
  container: string;
  priority: string;
  collectedBy: string;
  doctor: string;
  department: string;
}

interface ViewSampleDialogProps {
  open: boolean;
  sample: SampleData | null;
  onClose: () => void;
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <Box flex={1}>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        fontWeight={600}
        sx={{ mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function ViewSampleDialog({
  open,
  sample,
  onClose,
}: ViewSampleDialogProps) {
  if (!sample) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Sample Details

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>

        {/* Patient Information */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
          >
            Patient Information
          </Typography>

          <Stack spacing={2}>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
            >
              <DetailItem
                label="Patient"
                value={sample.patientName}
              />

              <DetailItem
                label="UHID"
                value={sample.uhid}
              />
            </Stack>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
            >
              <DetailItem
                label="Doctor"
                value={sample.doctor}
              />

              <DetailItem
                label="Department"
                value={sample.department}
              />
            </Stack>

          </Stack>
        </Paper>

        {/* Sample Information */}

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
          >
            Sample Information
          </Typography>

          <Stack spacing={2}>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
            >
              <DetailItem
                label="Tests"
                value={sample.tests}
              />

              <DetailItem
                label="Sample Type"
                value={sample.sampleType}
              />
            </Stack>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
            >
              <DetailItem
                label="Container"
                value={sample.container}
              />

              <DetailItem
                label="Priority"
                value={sample.priority}
              />
            </Stack>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
            >
              <DetailItem
                label="Collected By"
                value={sample.collectedBy}
              />

              <DetailItem
                label="Collected At"
                value={sample.collectedAt}
              />
            </Stack>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={3}
            >
              <DetailItem
                label="Barcode"
                value={sample.barcode}
              />

              <DetailItem
                label="Status"
                value={sample.status}
              />
            </Stack>

          </Stack>
        </Paper>

      </DialogContent>
    </Dialog>
  );
}