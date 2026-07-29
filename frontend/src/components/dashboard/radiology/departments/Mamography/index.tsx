"use client";

import DepartmentDashboard from "../dashboard/layout";
import { useRouter } from "next/navigation";

import type {
  RadiologyCase,
  TrendChartData,
  StatusDistributionData,
  ReportingTimeData,
} from "../dashboard/types";

import FemaleOutlinedIcon from "@mui/icons-material/FemaleOutlined";

// ============================
// MAMMOGRAPHY DATA
// ============================

const mammographyRows: RadiologyCase[] = [
  {
    id: "MAM001",
    patientName: "Neha Sharma",
    uhid: "UH20001",
    accessionNo: "ACC-MAM-001",
    study: "Screening Mammography",
    modality: "MAMMOGRAPHY",
    doctor: "Dr. Priya Mehta",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
  {
    id: "MAM002",
    patientName: "Pooja Verma",
    uhid: "UH20002",
    accessionNo: "ACC-MAM-002",
    study: "Diagnostic Mammography",
    modality: "MAMMOGRAPHY",
    doctor: "Dr. Anita Kapoor",
    priority: "Urgent",
    status: "VERIFIED",
    studyDate: "2026-07-25",
  },
  {
    id: "MAM003",
    patientName: "Sunita Gupta",
    uhid: "UH20003",
    accessionNo: "ACC-MAM-003",
    study: "Bilateral Mammography",
    modality: "MAMMOGRAPHY",
    doctor: "Dr. Ritu Sharma",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
];

// ============================
// KPI DATA
// ============================

const stats = [
  {
    title: "Total Mammography",
    text: 36,
  },
  {
    title: "Processing",
    text: 6,
  },
  {
    title: "Verified",
    text: 30,
  },
  {
    title: "Average Reporting",
    text: "16 min",
  },
];

// ============================
// TREND DATA
// ============================

const trendData: TrendChartData[] = [
  { label: "08:00", value: 3 },
  { label: "10:00", value: 8 },
  { label: "12:00", value: 12 },
  { label: "14:00", value: 18 },
  { label: "16:00", value: 14 },
  { label: "18:00", value: 9 },
];

// ============================
// STATUS DATA
// ============================

const statusData: StatusDistributionData[] = [
  {
    name: "Processing",
    value: 6,
  },
  {
    name: "Verified",
    value: 30,
  },
];

// ============================
// REPORTING DATA
// ============================

const reportingData: ReportingTimeData[] = [
  { day: "Mon", minutes: 16 },
  { day: "Tue", minutes: 15 },
  { day: "Wed", minutes: 18 },
  { day: "Thu", minutes: 17 },
  { day: "Fri", minutes: 15 },
  { day: "Sat", minutes: 14 },
  { day: "Sun", minutes: 16 },
];

// ============================
// PAGE
// ============================

export default function MammographyDashboard() {
  const router = useRouter();

  return (
    <DepartmentDashboard
      title="Mammography Dashboard"
      subtitle="Today's Mammography Workflow"
      description="Manage mammography studies, reporting and verification."
      icon={<FemaleOutlinedIcon />}
      stats={stats}
      trendData={trendData}
      statusData={statusData}
      reportingData={reportingData}
      chartConfig={{
        trendTitle: "Mammography Volume",
        trendSubtitle: "Today's Studies",
        statusTitle: "Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "Reporting Time",
        reportingSubtitle: "Last 7 Days",
      }}
      rows={mammographyRows}
      onVerify={(row) => {
        console.log("Verify Mammography Report", row.id);
      }}
      onViewReport={(row) => {
  router.push(`/radiology/reports/${row.id}`);
}}
      onRefresh={() => {
        console.log("Refresh Mammography Dashboard");
      }}
      onExport={() => {
        console.log("Export Mammography Reports");
      }}
    />
  );
}