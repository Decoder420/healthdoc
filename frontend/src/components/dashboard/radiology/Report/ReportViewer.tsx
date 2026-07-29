"use client";

import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import ReportHeader from "./ReportHeader";
import PatientCard from "./PatientCard";
import StudyCard from "./StudyCard";
import ClinicalHistory from "./ClinicalHistory";
import ImageGallery from "./ImageGallery";
import Findings from "./Findings";
import Impression from "./Impression";
import Signature from "./Signature";
import ReportFooter from "./ReportFooter";

import type { RadiologyReport } from "./types";

interface ReportViewerProps {
  report: RadiologyReport;
}

export default function ReportViewer({
  report,
}: ReportViewerProps) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.open(
      `/api/radiology/reports/${report.id}`,
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
        py: { xs: 2, md: 3 },
        px: { xs: 1, md: 2 },
      }}
    >
      {/* ================= Toolbar ================= */}
      <Paper
        elevation={2}
        className="no-print"
        sx={{
          position: "sticky",
          top: 16,
          zIndex: 1000,

          maxWidth: 980,
          mx: "auto",
          mb: 2.5,

          borderRadius: 3,

          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Radiology Report
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Report No.
              {" "}
              <strong>
                {report.report.reportNo}
              </strong>
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
          >
            <Button
              variant="outlined"
              startIcon={
                <ArrowBackRoundedIcon />
              }
              onClick={() => router.back()}
              sx={{
                borderRadius: 2,
                minWidth: 110,
              }}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <PrintRoundedIcon />
              }
              onClick={handlePrint}
              sx={{
                borderRadius: 2,
                minWidth: 110,
              }}
            >
              Print
            </Button>

            <Button
              variant="contained"
              startIcon={
                <DownloadRoundedIcon />
              }
              onClick={handleDownload}
              sx={{
                borderRadius: 2,
                minWidth: 170,
              }}
            >
              Download PDF
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ================= Report ================= */}

      <Paper
        elevation={6}
        sx={{
          maxWidth: 980,
          mx: "auto",

          bgcolor: "#fff",

          borderRadius: 3,

          border: "1px solid",
          borderColor: "divider",

          p: {
            xs: 2,
            md: 4,
          },

          display: "flex",
          flexDirection: "column",

          gap: 2,

          "@media print": {
            maxWidth: "100%",
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
            p: 0,
          },
        }}
      >
        {/* Header */}
        <ReportHeader
          hospital={report.hospital}
          report={report.report}
        />

        {/* Patient Information */}
        <PatientCard
          patient={report.patient}
          doctor={report.doctor}
          visit={report.visit}
        />

        {/* Study Information */}
        <StudyCard
          study={report.study}
        />

        {/* Clinical History */}
        <ClinicalHistory
          clinicalHistory={
            report.clinicalHistory
          }
        />

        {/* Images */}
        <ImageGallery
          images={report.images}
        />

        {/* Findings */}
        <Findings
          findings={report.findings}
        />

        {/* Impression */}
        <Impression
          impression={report.impression}
        />

        {/* Signature */}
        <Signature
          radiologist={
            report.radiologist
          }
        />

        {/* Footer */}
        <ReportFooter
          generatedOn={
            report.generatedOn
          }
          hospital={report.hospital}
        />
      </Paper>
    </Box>
  );
}