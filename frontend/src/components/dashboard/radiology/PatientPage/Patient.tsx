"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import {
  appointmentQueue,
} from "@/components/dashboard/radiology/test_queue/DummyData";

import RadiologyPatientHeader from "./PatientHeader";
import RadiologyPatientKPICards from "./PatientKpiCards";
import RadiologyPatientOverview from "./PatientOverview";
import RadiologyStudies from "./PatientLabOrders";
import RadiologyReports from "./PatientReports";
import RadiologyTimeline from "./PatientTimeline";

interface RadiologyPatientProfilePageProps {
  patientId: string;
}

export default function RadiologyPatientProfilePage({
  patientId,
}: RadiologyPatientProfilePageProps) {
  const [tab, setTab] = useState(0);

  /*
   * Get all radiology studies belonging
   * to this patient.
   */
  const studies = useMemo(() => {
    return appointmentQueue.filter(
      (item) =>
        item.patientId.toLowerCase() ===
        patientId.toLowerCase()
    );
  }, [patientId]);

  /*
   * Patient not found
   */
  if (!studies.length) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
        >
          Patient not found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          No radiology studies were found
          for this patient.
        </Typography>
      </Box>
    );
  }

  /*
   * Use the latest/current study
   * for patient-level information.
   */
  const patient = studies[0];

  /*
   * Verified radiology reports
   */
  const reports = studies
    .filter(
      (study) =>
        study.reportStatus === "Verified"
    )
    .map((study) => ({
      reportId: study.reportId,
      accessionNumber:
        study.accessionNumber,
      studyId: study.dicomStudyId,
      modality: study.modality,
      procedure: study.procedure,
      radiologist: study.radiologist,
      verifiedDate:
        study.appointmentDate,
      status: study.reportStatus,
    }));

  return (
    <Box>
      {/* ================= PATIENT HEADER ================= */}

      <RadiologyPatientHeader
        patient={patient}
      />

      {/* ================= KPI CARDS ================= */}

      <RadiologyPatientKPICards
        studies={studies}
      />

      {/* ================= TABS ================= */}

      <Tabs
        value={tab}
        onChange={(_, value) =>
          setTab(value)
        }
        sx={{
          mb: 3,
          minHeight: 42,
          borderBottom: 1,
          borderColor: "divider",

          "& .MuiTab-root": {
            minHeight: 42,
            px: 2.5,
            fontWeight: 600,
            textTransform: "none",
          },
        }}
      >
        <Tab label="Overview" />

        <Tab label="Studies" />

        <Tab label="Reports" />

        <Tab label="Timeline" />
      </Tabs>

      {/* ================= OVERVIEW ================= */}

      {tab === 0 && (
        <RadiologyPatientOverview
          patient={patient}
        />
      )}

      {/* ================= STUDIES ================= */}

      {tab === 1 && (
        <RadiologyStudies
          studies={studies}
        />
      )}

      {/* ================= REPORTS ================= */}

      {tab === 2 && (
        <RadiologyReports
          reports={reports}
        />
      )}

      {/* ================= TIMELINE ================= */}

      {tab === 3 && (
        <RadiologyTimeline
          studies={studies}
        />
      )}
    </Box>
  );
}
