"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";

interface ReportActionsProps {
  reportId: string;
}

export default function ReportActions({
  reportId,
}: ReportActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownload = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `/api/radiology/reports/${reportId}`
    );

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const blob = await response.blob();

    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `${reportId}.pdf`;
    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Unable to download PDF."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Paper
  elevation={2}
  sx={{
    maxWidth: 980,
    mx: "auto",
    mb: 3,
    p: 2,
    borderRadius: 3,

    border: "1px solid",
    borderColor: "divider",

    bgcolor: "background.paper",
  }}
>
  <Stack
    direction={{
      xs: "column",
      sm: "row",
    }}
    justifyContent="space-between"
    alignItems="center"
    spacing={2}
  >
    <Button
      startIcon={<ArrowBackIcon />}
      variant="outlined"
      onClick={() => router.back()}
    >
      Back
    </Button>

    <Stack
      direction="row"
      spacing={2}
    >
      <Button
        startIcon={<PrintIcon />}
        variant="outlined"
        onClick={handlePrint}
      >
        Print
      </Button>

      <Button
        variant="contained"
        startIcon={
          loading ? (
            <CircularProgress
              size={18}
              color="inherit"
            />
          ) : (
            <DownloadIcon />
          )
        }
        onClick={handleDownload}
        disabled={loading}
      >
        {loading
          ? "Generating..."
          : "Download PDF"}
      </Button>
    </Stack>
  </Stack>
</Paper>
</>
  );
}