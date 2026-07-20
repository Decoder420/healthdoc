"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Divider,
  Paper,
} from "@mui/material";

import BarcodeDisplay from "@/components/shared/BarcodeDisplay";

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

interface BarcodePrintDialogProps {
  open: boolean;
  sample: SampleData | null;
  onClose: () => void;
}

export default function BarcodePrintDialog({
  open,
  sample,
  onClose,
}: BarcodePrintDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

 const reactToPrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: sample?.barcode ?? "Barcode",
  pageStyle: `
    @page {
      size: auto;
      margin: 12mm;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      canvas,
      svg {
        display: block !important;
        visibility: visible !important;
      }
    }
  `,
});

const handlePrint = () => {
  setTimeout(() => {
    reactToPrint();
  }, 300);
};

  if (!sample) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Print Barcode</DialogTitle>

      <Divider />

      <DialogContent>
        <Paper
  ref={printRef}
  elevation={0}
  sx={{
    p: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: "1px solid",
    borderColor: "divider",
    minHeight: 350,
    textAlign: "center",
  }}
>
  <Stack
    spacing={2}
    alignItems="center"
    justifyContent="center"
    width="100%"
  >
    <Typography
      variant="h6"
      fontWeight={700}
      align="center"
    >
      {sample.patientName}
    </Typography>

    <Typography
      variant="body2"
      align="center"
    >
      <strong>UHID:</strong> {sample.uhid}
    </Typography>

    <Typography
      variant="body2"
      align="center"
    >
      <strong>Test:</strong> {sample.tests}
    </Typography>

    <Box
      display="flex"
      justifyContent="center"
      width="100%"
      my={2}
    >
      <BarcodeDisplay value={sample.barcode} />
    </Box>

    <Typography
      fontFamily="monospace"
      fontWeight={700}
      align="center"
    >
      {sample.barcode}
    </Typography>
  </Stack>
</Paper>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>

       <Button
  variant="contained"
  onClick={handlePrint}
>
  Print Barcode
</Button>
      </DialogActions>
    </Dialog>
  );
}