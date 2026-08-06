"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { loadReportDraft } from "@/components/dashboard/radiology/test_result/reportDraftStorage";

import type { RadiologyReport } from "./types";

interface ReportViewerProps {
  report?: RadiologyReport | null;
  accessionNumber?: string;
}

export default function ReportViewer({
  report,
  accessionNumber,
}: ReportViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resolvedReport, setResolvedReport] =
    useState<RadiologyReport | null>(report ?? null);

  const isPdfMode =
    searchParams.get("pdf") === "1";

  useEffect(() => {
    if (!report) {
      setResolvedReport(null);
      return;
    }

    const draftKey =
      accessionNumber || report.report.accessionNo;
    const draft = draftKey
      ? loadReportDraft(draftKey)
      : null;

    if (!draft) {
      setResolvedReport(report);
      return;
    }

    setResolvedReport({
      ...report,
      findings: draft.findings.trim() || report.findings,
      impression:
        draft.impression.trim() || report.impression,
      report: {
        ...report.report,
        status: draft.verified
          ? "VERIFIED"
          : report.report.status,
      },
    });
  }, [report, accessionNumber]);


  /* =========================
     Safety Check
  ========================= */

  if (!resolvedReport) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
        >
          Report not found
        </Typography>
      </Box>
    );
  }


  /* =========================
     Actions
  ========================= */

  const handlePrint = () => {
    window.print();
  };


  const handleDownload = () => {

    if (!resolvedReport.id) {
      console.error(
        "Missing report id"
      );
      return;
    }


    window.open(
      `/api/radiology/reports/${resolvedReport.id}`,
      "_blank"
    );
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor:
          isPdfMode
            ? "#fff"
            : "#F5F7FB",

        py:
          isPdfMode
            ? 0
            : {
                xs: 2,
                md: 3,
              },

        px:
          isPdfMode
            ? 0
            : {
                xs: 1,
                md: 2,
              },
      }}
    >


      {/* ================= Toolbar ================= */}

      {!isPdfMode && (

        <Paper
          className="no-print"
          elevation={2}

          sx={{
            position: "sticky",
            top: 16,
            zIndex: 1000,

            maxWidth: 980,
            mx: "auto",
            mb: 2.5,

            borderRadius: 3,

            border:
              "1px solid",

            borderColor:
              "divider",
          }}
        >

          <Stack
            direction={{
              xs:"column",
              md:"row",
            }}

            justifyContent="space-between"

            alignItems={{
              xs:"stretch",
              md:"center",
            }}

            spacing={2}

            sx={{
              p:2,
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

                Report No:

                {" "}

                <strong>
                  {
                    resolvedReport.report
                      ?.reportNo
                    ??
                    "N/A"
                  }
                </strong>

              </Typography>


            </Box>



            <Stack
              direction={{
                xs:"column",
                sm:"row",
              }}

              spacing={1.5}
            >


              <Button
                variant="outlined"

                startIcon={
                  <ArrowBackRoundedIcon/>
                }

                onClick={() =>
                  router.back()
                }

                sx={{
                  borderRadius:2,
                  minWidth:110,
                }}
              >
                Back
              </Button>



              <Button
                variant="outlined"

                startIcon={
                  <PrintRoundedIcon/>
                }

                onClick={
                  handlePrint
                }

                sx={{
                  borderRadius:2,
                  minWidth:110,
                }}
              >
                Print
              </Button>



              <Button
                variant="contained"

                startIcon={
                  <DownloadRoundedIcon/>
                }

                onClick={
                  handleDownload
                }

                sx={{
                  borderRadius:2,
                  minWidth:170,
                }}
              >
                Download PDF
              </Button>


            </Stack>


          </Stack>


        </Paper>

      )}



      {/* ================= Report Body ================= */}


      <Paper

        id="radiology-report"

        elevation={6}

        sx={{

          maxWidth:980,

          mx:"auto",

          bgcolor:"#fff",

          borderRadius:3,

          border:
            "1px solid",

          borderColor:
            "divider",


          p:{
            xs:2,
            md:4,
          },


          display:"flex",

          flexDirection:"column",

          gap:2,


          "@media print":{

            maxWidth:"100%",

            border:"none",

            borderRadius:0,

            boxShadow:"none",

            p:0,
          },

        }}
      >



        <ReportHeader

          hospital={
            resolvedReport.hospital
          }

          report={
            resolvedReport.report
          }

        />



        <PatientCard

          patient={
            resolvedReport.patient
          }

          doctor={
            resolvedReport.doctor
          }

          visit={
            resolvedReport.visit
          }

        />



        <StudyCard

          study={
            resolvedReport.study
          }

        />



        <ClinicalHistory

          clinicalHistory={
            resolvedReport.clinicalHistory
            ??
            ""
          }

        />



        <ImageGallery

          images={
            resolvedReport.images
            ??
            []
          }

        />



        <Findings

          findings={
            resolvedReport.findings
            ??
            ""
          }

        />



        <Impression

          impression={
            resolvedReport.impression
            ??
            ""
          }

        />



        <Signature

          radiologist={
            resolvedReport.radiologist
          }

        />



        <ReportFooter

          generatedOn={
            resolvedReport.generatedOn
          }

          hospital={
            resolvedReport.hospital
          }

        />


      </Paper>


    </Box>
  );
}