"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

import BarcodeDisplay from "@/components/shared/BarcodeDisplay";

interface BarcodeSectionProps {
  barcode: string;
  onGenerate: (barcode: string) => void;
}

export default function BarcodeSection({
  barcode,
  onGenerate,
}: BarcodeSectionProps) {
  const [loading, setLoading] = useState(false);

  let currentDate = "";
let serialNumber = 0;


  const generateBarcode = () => {
    setLoading(true);
      const today = new Date();

  const date =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  if (date !== currentDate) {
    currentDate = date;
    serialNumber = 1;
  } else {
    serialNumber++;
  }


    const generatedBarcode = `LAB-${date}-${String(serialNumber).padStart(4, "0")}`;

    setTimeout(() => {
      onGenerate(generatedBarcode);
      setLoading(false);
    }, 500);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
      >
        Barcode
      </Typography>

      <Stack
        spacing={3}
        alignItems="center"
      >
        {barcode ? (
          <>
            <BarcodeDisplay
              value={barcode}
              width={2}
              height={60}
              displayValue
            />

            <Typography
              fontWeight={700}
              variant="body1"
            >
              {barcode}
            </Typography>
          </>
        ) : (
          <Box
            sx={{
              py: 4,
            }}
          >
            <Typography color="text.secondary">
              Barcode has not been generated yet.
            </Typography>
          </Box>
        )}

        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            variant="contained"
            startIcon={<AutorenewRoundedIcon />}
            onClick={generateBarcode}
            disabled={loading}
          >
            Generate Barcode
          </Button>

          <Button
            variant="outlined"
            startIcon={<PrintRoundedIcon />}
            disabled={!barcode}
          >
            Print Label
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}