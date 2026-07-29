"use client";

import DepartmentDashboard from "../dashboard/layout";
import { useRouter } from "next/navigation";

import type {
  RadiologyCase,
  TrendChartData,
  StatusDistributionData,
  ReportingTimeData,
} from "../dashboard/types";

import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";

// ============================
// X-RAY DATA
// ============================

const xrayRows: RadiologyCase[] = [
  {
    id: "XR001",
    patientName: "Rahul Sharma",
    uhid: "UH30001",
    accessionNo: "ACC-XR-001",
    study: "Chest X-Ray PA View",
    modality: "XRAY",
    doctor: "Dr. Mehta",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
  {
    id: "XR002",
    patientName: "Anita Verma",
    uhid: "UH30002",
    accessionNo: "ACC-XR-002",
    study: "Knee X-Ray AP/Lateral",
    modality: "XRAY",
    doctor: "Dr. Sharma",
    priority: "Urgent",
    status: "VERIFIED",
    studyDate: "2026-07-25",
  },
  {
    id: "XR003",
    patientName: "Mohit Singh",
    uhid: "UH30003",
    accessionNo: "ACC-XR-003",
    study: "Cervical Spine X-Ray",
    modality: "XRAY",
    doctor: "Dr. Kapoor",
    priority: "STAT",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
];

// ============================
// KPI DATA
// ============================

const stats = [
  {
    title: "Total X-Ray Cases",
    text: 124,
  },
  {
    title: "Processing",
    text: 18,
  },
  {
    title: "Verified",
    text: 106,
  },
  {
    title: "Average Reporting",
    text: "10 min",
  },
];

// ============================
// TREND DATA
// ============================

const trendData: TrendChartData[] = [
  { label: "08:00", value: 12 },
  { label: "10:00", value: 26 },
  { label: "12:00", value: 38 },
  { label: "14:00", value: 47 },
  { label: "16:00", value: 34 },
  { label: "18:00", value: 22 },
];

// ============================
// STATUS DATA
// ============================

const statusData: StatusDistributionData[] = [
  {
    name: "Processing",
    value: 18,
  },
  {
    name: "Verified",
    value: 106,
  },
];

// ============================
// REPORTING DATA
// ============================

const reportingData: ReportingTimeData[] = [
  { day: "Mon", minutes: 10 },
  { day: "Tue", minutes: 9 },
  { day: "Wed", minutes: 11 },
  { day: "Thu", minutes: 10 },
  { day: "Fri", minutes: 9 },
  { day: "Sat", minutes: 8 },
  { day: "Sun", minutes: 10 },
];

// ============================
// PAGE
// ============================

export default function XRayDashboard() {
  const router = useRouter();

  return (
    <DepartmentDashboard
      title="X-Ray Dashboard"
      subtitle="Today's X-Ray Workflow"
      description="Manage X-Ray studies, verification and reporting."
      icon={<BiotechOutlinedIcon />}
      stats={stats}
      trendData={trendData}
      statusData={statusData}
      reportingData={reportingData}
      chartConfig={{
        trendTitle: "X-Ray Study Volume",
        trendSubtitle: "Today's X-Ray studies",
        statusTitle: "X-Ray Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "X-Ray Reporting Time",
        reportingSubtitle: "Last 7 Days",
      }}
      rows={xrayRows}
      onVerify={(row) => {
        console.log("Verify X-Ray Report", row.id);
      }}
      onViewReport={(row) => {
  router.push(`/radiology/reports/${row.id}`);
}}
      onRefresh={() => {
        console.log("Refresh X-Ray Dashboard");
      }}
      onExport={() => {
        console.log("Export X-Ray Reports");
      }}
    />
  );
}