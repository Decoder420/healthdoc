"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import ActionButtons from "./ActionButtons";
import FindingsCard from "./FindingsCard";
import ImageViewer from "./ImageViewer";
import ImpressionCard from "./ImpressionCard";
import PatientDetailsCard from "./PatientDetailsCard";
import RecommendationCard from "./RecommendationCard";
import SearchPatient from "./SearchPatient";
import StudyDetailsCard from "./StudyDetailsCard";

import {
  reportPatients,
  searchPatients,
} from "./dummyReportData";
import { saveReportDraft } from "./reportDraftStorage";

import type {
  RadiologyReportPatient,
} from "./types";

export default function ReportEntryPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  // Read accession number from URL
  const accessionNumber =
    searchParams.get(
      "accessionNumber"
    );

  const [search, setSearch] =
    useState("");

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState<RadiologyReportPatient | null>(
    null
  );

  const [findings, setFindings] =
    useState("");

  const [
    impression,
    setImpression,
  ] = useState("");

  const [
    recommendation,
    setRecommendation,
  ] = useState("");

  const [
    findingsError,
    setFindingsError,
  ] = useState("");

  const [
    impressionError,
    setImpressionError,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const patientOptions = useMemo(
    () => searchPatients,
    []
  );

  // =====================================
  // Auto-load patient using Accession No.
  // =====================================
  useEffect(() => {
    if (!accessionNumber) {
      return;
    }

    const patient =
      reportPatients.find(
        (item) =>
          item.accessionNumber ===
          accessionNumber
      ) ?? null;

    setSelectedPatient(patient);

    if (patient) {
      setSearch(
        patient.accessionNumber
      );

      setFindings(
        patient.report.findings
      );

      setImpression(
        patient.report.impression
      );

      setRecommendation(
        patient.report
          .recommendation
      );
    }
  }, [accessionNumber]);

  // =====================================
  // Manual Search
  // =====================================
  const handleSearch = () => {
    if (!search.trim()) {
      return;
    }

    const keyword =
      search.toLowerCase();

    const patient =
      reportPatients.find(
        (item) =>
          item.patientName
            .toLowerCase()
            .includes(keyword) ||
          item.uhid
            .toLowerCase()
            .includes(keyword) ||
          item.patientId
            .toLowerCase()
            .includes(keyword) ||
          item.visitId
            .toLowerCase()
            .includes(keyword) ||
          item.orderId
            .toLowerCase()
            .includes(keyword) ||
          item.accessionNumber
            .toLowerCase()
            .includes(keyword)
      ) ?? null;

    setSelectedPatient(patient);

    if (patient) {
      setFindings(
        patient.report.findings
      );

      setImpression(
        patient.report.impression
      );

      setRecommendation(
        patient.report
          .recommendation
      );
    }
  };

const persistDraft = (verified = false) => {
  if (!selectedPatient) return;

  saveReportDraft(selectedPatient.accessionNumber, {
    findings,
    impression,
    recommendation,
    verified,
  });
};

const openCompletedReport = (verified = false) => {
  if (!selectedPatient) return;

  persistDraft(verified);
  router.push(
    `/radiology/reports/${selectedPatient.accessionNumber}`
  );
};

 // =====================================
// Save Draft
// =====================================
const handleSaveDraft = async () => {
  if (!selectedPatient) {
    return;
  }

  setLoading(true);

  await new Promise((resolve) =>
    setTimeout(resolve, 1000)
  );

  persistDraft(false);

  setLoading(false);
};

// =====================================
// View completed report (after fields filled)
// =====================================
const handleViewReport = () => {
  if (!findings.trim()) {
    setFindingsError("Findings are required.");
    return;
  }

  if (!impression.trim()) {
    setImpressionError("Impression is required.");
    return;
  }

  openCompletedReport(false);
};

// =====================================
// Verify Report
// =====================================
const handleVerify = async () => {
  let valid = true;

  if (!findings.trim()) {
    setFindingsError("Findings are required.");
    valid = false;
  } else {
    setFindingsError("");
  }

  if (!impression.trim()) {
    setImpressionError("Impression is required.");
    valid = false;
  } else {
    setImpressionError("");
  }

  if (!selectedPatient || !valid) {
    return;
  }

  setLoading(true);

  await new Promise((resolve) =>
    setTimeout(resolve, 1200)
  );

  setLoading(false);

  openCompletedReport(true);
};


  const canVerify =
    findings.trim().length > 0 &&
    impression.trim().length > 0;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <IconButton
            onClick={() => router.back()}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Enter Radiology Report
          </Typography>
        </Stack>

        <Divider />

        <SearchPatient
  search={search}
  patients={patientOptions}
  onSearchChange={setSearch}
  onSearch={handleSearch}
  disabled={true}
/>

        {selectedPatient && (
          <>
            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <PatientDetailsCard
                  patient={{
                    patientName:
                      selectedPatient.patientName,
                    uhid:
                      selectedPatient.uhid,
                    patientId:
                      selectedPatient.patientId,
                    visitId:
                      selectedPatient.visitId,
                    token:
                      selectedPatient.token,
                    age:
                      selectedPatient.age,
                    gender:
                      selectedPatient.gender,
                    priority:
                      selectedPatient.priority,
                  }}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <StudyDetailsCard
                  study={{
                    modality:
                      selectedPatient.modality,
                    procedure:
                      selectedPatient.procedure,
                    radiologist:
                      selectedPatient.radiologist,
                    referringDoctor:
                      selectedPatient.referringDoctor,
                    accessionNumber:
                      selectedPatient.accessionNumber,
                    orderId:
                      selectedPatient.orderId,
                    appointmentDate:
                      selectedPatient.appointmentDate,
                    appointmentTime:
                      selectedPatient.appointmentTime,
                    studyStatus:
                      selectedPatient.studyStatus,
                  }}
                />
              </Grid>
            </Grid>

            <ImageViewer
              images={
                selectedPatient.images
              }
            />
                        <FindingsCard
              value={findings}
              error={findingsError}
              onChange={(value) => {
                setFindings(value);

                if (findingsError) {
                  setFindingsError("");
                }
              }}
            />

            <ImpressionCard
              value={impression}
              error={impressionError}
              onChange={(value) => {
                setImpression(value);

                if (impressionError) {
                  setImpressionError("");
                }
              }}
            />

            <RecommendationCard
              value={recommendation}
              onChange={setRecommendation}
            />

            <ActionButtons
              loading={loading}
              canVerify={canVerify}
              onSaveDraft={handleSaveDraft}
              onVerify={handleVerify}
              onViewReport={handleViewReport}
            />
          </>
        )}

        {!selectedPatient &&
          accessionNumber && (
            <Typography
              textAlign="center"
              color="error"
              sx={{ py: 6 }}
            >
              No study found for
              Accession Number:{" "}
              <strong>
                {accessionNumber}
              </strong>
            </Typography>
          )}
      </Stack>
    </Box>
  );
}