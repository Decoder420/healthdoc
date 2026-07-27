"use client";

import { useMemo, useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import { patients } from "@/lib/mock/lab_data";
import { getStatusColor } from "@/lib/utils/statuscolor";

import PatientHeader from "./PatientHeader";
import PatientKPICards from "./PatientKPICards";
import PatientOverview from "./PatientOverview";
import PatientVisits from "./PatientVisit";
import PatientLabOrders from "./PatientLabOrders";
import PatientReports from "./PatientReport";
import PatientTimeline from "./PatientTimeline";

interface PatientProfilePageProps {
  patientId: string;
}

export default function PatientProfilePage({
  patientId,
}: PatientProfilePageProps) {
  const [tab, setTab] = useState(0);

  const visits = useMemo(() => {
    return patients.filter(
      (item) =>
        item.patient.patientId.toLowerCase() ===
        patientId.toLowerCase()
    );
  }, [patientId]);

  if (!visits.length) {
    return (
      <Box p={5}>
        Patient not found.
      </Box>
    );
  }

  const patient = visits[0];

  return (
    <Box p={4}>
      <PatientHeader patient={patient} />

      <PatientKPICards visits={visits} />

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 4 }}
      >
        <Tab label="Overview" />
        <Tab label="Visits" />
        <Tab label="Lab Orders" />
        <Tab label="Reports" />
        <Tab label="Timeline" />
      </Tabs>

      {tab === 0 && (
        <PatientOverview patient={patient} />
      )}

      {tab === 1 && (
        <PatientVisits visits={visits} />
      )}

      {tab === 2 && (
        <PatientLabOrders visits={visits} />
      )}

      {tab === 3 && (
        <PatientReports
          reports={[
            {
              reportId: "REP240001",
              visitId: "VIS001",
              testCount: 6,
              verifiedBy: "Dr. Sharma",
              verifiedDate: "2026-07-21T11:30:00Z",
              status: "Verified",
            },
            {
              reportId: "REP240002",
              visitId: "VIS002",
              testCount: 4,
              verifiedBy: "Dr. Mehta",
              verifiedDate: "2026-07-18T09:45:00Z",
              status: "Verified",
            },
          ]}
        />
      )}

      {tab === 4 && (
        <PatientTimeline
          visits={visits}
          getStatusColor={getStatusColor}
        />
      )}
    </Box>
  );
}