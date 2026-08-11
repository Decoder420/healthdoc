"use client";

import { useRef, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

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

  /*
   * Keep the serial number stable between renders.
   * This component generates only one barcode for the
   * current sample.
   */
  const currentDateRef = useRef("");
  const serialNumberRef = useRef(0);

  const generateBarcode = () => {
    // Do not allow another barcode for the same sample.
    if (loading || barcode) return;

    setLoading(true);

    const today = new Date();

    const date =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");

    /*
     * Reset the serial number when the date changes.
     */
    if (date !== currentDateRef.current) {
      currentDateRef.current = date;
      serialNumberRef.current = 1;
    } else {
      serialNumberRef.current += 1;
    }

    const generatedBarcode = `LAB-${date}-${String(
      serialNumberRef.current
    ).padStart(4, "0")}`;

    /*
     * Small delay to show generation state.
     */
    setTimeout(() => {
      onGenerate(generatedBarcode);
      setLoading(false);
    }, 400);
  };

  return (
    <Paper
      elevation={0}
      className="surface-card"
      sx={{
        overflow: "hidden",
      }}
    >
      {/* ============================================================
          HEADER
      ============================================================ */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            lineHeight: 1.3,
          }}
        >
          Barcode
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
          }}
        >
          Generate a unique barcode for this sample
        </Typography>
      </Box>

      {/* ============================================================
          CONTENT
      ============================================================ */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
        >
          {/* ========================================================
              BARCODE
          ======================================================== */}
          {barcode ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  minHeight: 105,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  overflow: "hidden",
                  py: 1,

                  "& svg": {
                    display: "block",
                    maxWidth: "100%",
                  },

                  "& canvas": {
                    display: "block",
                    maxWidth: "100%",
                  },
                }}
              >
                <BarcodeDisplay
                  value={barcode}
                  displayValue
                />
              </Box>

              {/* Barcode Value */}
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{
                  fontFamily:
                    "var(--font-ibm-plex-mono), monospace",
                  letterSpacing: "0.04em",
                }}
              >
                {barcode}
              </Typography>
            </>
          ) : (
            /* ========================================================
               EMPTY STATE
            ======================================================== */
            <Box
              sx={{
                width: "100%",
                minHeight: 105,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Barcode has not been generated yet.
              </Typography>
            </Box>
          )}

          {/* ========================================================
              GENERATE BUTTON
          ======================================================== */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AutorenewRoundedIcon />}
            onClick={generateBarcode}
            disabled={loading || Boolean(barcode)}
            sx={{
              minHeight: 34,
              px: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading
              ? "Generating..."
              : "Generate Barcode"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
