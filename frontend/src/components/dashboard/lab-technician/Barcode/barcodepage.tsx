"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";

import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import BarcodeDisplay from "@/components/shared/BarcodeDisplay";
import { getLabBarcodeSamples } from "@/lib/mock/lab_data";

export default function BarcodePage() {
  const samples = useMemo(() => getLabBarcodeSamples(1000), []);

  const [search, setSearch] = useState("");

  const [value, setValue] = useState(
    samples[0]?.barcode ?? "LAB-2026-0018"
  );

  const printRef = useRef<HTMLDivElement>(null);

  const selectedSample = samples.find(
    (item) => item.barcode === value
  );

  const filteredSamples = samples
    .filter((sample) => {
      const keyword = search.toLowerCase().trim();

      if (!keyword) return true;

      return (
        sample.barcode.toLowerCase().includes(keyword) ||
        sample.orderId.toLowerCase().includes(keyword) ||
        sample.patientName.toLowerCase().includes(keyword) ||
        sample.uhid.toLowerCase().includes(keyword)
      );
    })
    .slice(0, 10);

  const handlePrint = useReactToPrint({
    contentRef: printRef,

    documentTitle: selectedSample
      ? `${selectedSample.barcode}-barcode`
      : "Lab Barcode",

    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 5mm;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      @media print {
        body * {
          visibility: hidden;
        }

        #barcode-print-area,
        #barcode-print-area * {
          visibility: visible;
        }

        #barcode-print-area {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }

        svg,
        canvas {
          display: block !important;
          visibility: visible !important;
        }
      }
    `,
  });

  const printBarcode = () => {
    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  return (
    <Box
      component="main"
      sx={{
        maxWidth: 1120,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
          lg: 4,
        },
        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      {/* ============================================================= */}
      {/* PAGE HEADER                                                    */}
      {/* ============================================================= */}

      <Stack spacing={1} mb={3.5}>
        <Box>
          <Link href="/lab/dashboard">
            <Button
              variant="outlined"
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              ← Back to Lab Dashboard
            </Button>
          </Link>
        </Box>

        <Box mt={1}>
          <Typography
            variant="h4"
            fontWeight={700}
            letterSpacing="-0.02em"
          >
            Barcode Generator
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
          >
            Search laboratory samples, select a barcode, and print
            the sample label.
          </Typography>
        </Box>
      </Stack>

      {/* ============================================================= */}
      {/* SEARCH PANEL                                                    */}
      {/* ============================================================= */}

      <Paper
        elevation={0}
        className="surface-card"
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          mb: 3,
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Find Sample
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Search by barcode, order ID, patient name, or UHID.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              fullWidth
              label="Search Sample"
              placeholder="Barcode / Order ID / Patient / UHID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              size="small"
              fullWidth
              label="Barcode Value"
              placeholder="Enter barcode"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>
        </Stack>
      </Paper>

      {/* ============================================================= */}
      {/* MAIN CONTENT                                                    */}
      {/* ============================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {/* =========================================================== */}
        {/* BARCODE PREVIEW                                               */}
        {/* =========================================================== */}

        <Paper
          id="barcode-print-area"
          ref={printRef}
          elevation={0}
          className="surface-card"
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            height: "100%",
          }}
        >
          <Stack
            spacing={2.5}
            sx={{
              height: "100%",
            }}
          >
            {/* Preview Header */}

            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
              >
                Barcode Preview
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Review the label before printing.
              </Typography>
            </Box>

            <Divider />

            {/* Barcode Preview Area */}

            <Box
              sx={{
                flex: 1,
                minHeight: {
                  xs: 240,
                  sm: 280,
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
                px: {
                  xs: 1.5,
                  sm: 3,
                },
                py: 3,
              }}
            >
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <BarcodeDisplay value={value} />
                </Box>

                {selectedSample ? (
                  <Stack
                    spacing={0.5}
                    alignItems="center"
                    textAlign="center"
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                    >
                      {selectedSample.patientName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      UHID: {selectedSample.uhid}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Order ID: {selectedSample.orderId}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Barcode: {selectedSample.barcode}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Enter a valid barcode value to preview
                    the sample label.
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Print Button */}

            <Button
              variant="contained"
              fullWidth
              disabled={!value}
              onClick={printBarcode}
              sx={{
                minHeight: 44,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Print Barcode
            </Button>
          </Stack>
        </Paper>

        {/* =========================================================== */}
        {/* SAMPLE LIST                                                   */}
        {/* =========================================================== */}

        <Paper
          elevation={0}
          className="surface-card"
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            height: "100%",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              height: "100%",
            }}
          >
            {/* List Header */}

            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                >
                  Sample Barcodes
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    flexShrink: 0,
                  }}
                >
                  {filteredSamples.length}/10
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Select a sample to load its barcode.
              </Typography>
            </Box>

            <Divider />

            {/* Sample List */}

            <Stack
              spacing={1}
              sx={{
                flex: 1,
              }}
            >
              {filteredSamples.length > 0 ? (
                filteredSamples.map((sample) => {
                  const isSelected =
                    value === sample.barcode;

                  return (
                    <Button
                      key={sample.barcode}
                      variant={
                        isSelected
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() =>
                        setValue(sample.barcode)
                      }
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        textAlign: "left",
                        textTransform: "none",
                        minHeight: 66,
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          minWidth: 0,
                          overflow: "hidden",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          noWrap
                          sx={{
                            lineHeight: 1.4,
                          }}
                        >
                          {sample.barcode}
                        </Typography>

                        <Typography
                          variant="caption"
                          color={
                            isSelected
                              ? "inherit"
                              : "text.secondary"
                          }
                          sx={{
                            display: "block",
                            mt: 0.25,
                            lineHeight: 1.4,
                          }}
                          noWrap
                        >
                          {sample.patientName}
                          {" · "}
                          {sample.uhid}
                        </Typography>

                        <Typography
                          variant="caption"
                          color={
                            isSelected
                              ? "inherit"
                              : "text.secondary"
                          }
                          sx={{
                            display: "block",
                            mt: 0.15,
                            lineHeight: 1.4,
                          }}
                          noWrap
                        >
                          Order ID: {sample.orderId}
                        </Typography>
                      </Box>
                    </Button>
                  );
                })
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 2,
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      No barcode found
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Try another barcode, patient name,
                      UHID, or order ID.
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
