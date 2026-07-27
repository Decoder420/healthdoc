"use client";

import DepartmentDashboard from "../dashboard/layout";

import type {
  RadiologyCase,
  TrendChartData,
  StatusDistributionData,
  ReportingTimeData,
} from "../dashboard/types";

import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";

const mriRows: RadiologyCase[] = [
  {
    id: "MRI001",
    patientName: "Rohit Sharma",
    uhid: "UH20001",
    accessionNo: "ACC-MRI-001",
    study: "MRI Brain",
    modality: "MRI",
    doctor: "Dr. Sharma",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
  {
    id: "MRI002",
    patientName: "Neha Gupta",
    uhid: "UH20002",
    accessionNo: "ACC-MRI-002",
    study: "MRI Spine",
    modality: "MRI",
    doctor: "Dr. Mehta",
    priority: "Urgent",
    status: "VERIFIED",
    studyDate: "2026-07-25",
  },
  {
    id: "MRI003",
    patientName: "Amit Verma",
    uhid: "UH20003",
    accessionNo: "ACC-MRI-003",
    study: "MRI Knee",
    modality: "MRI",
    doctor: "Dr. Kapoor",
    priority: "STAT",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
];

const stats = [
  {
    title: "Total MRI Cases",
    text: 38,
  },
  {
    title: "Processing",
    text: 6,
  },
  {
    title: "Verified",
    text: 29,
  },
  {
    title: "Average Reporting",
    text: "24 min",
  },
];

const trendData: TrendChartData[] = [
  { label: "08:00", value: 3 },
  { label: "10:00", value: 7 },
  { label: "12:00", value: 12 },
  { label: "14:00", value: 18 },
  { label: "16:00", value: 15 },
  { label: "18:00", value: 9 },
];

const statusData: StatusDistributionData[] = [
  {
    name: "Processing",
    value: 6,
  },
  {
    name: "Verified",
    value: 29,
  },
];

const reportingData: ReportingTimeData[] = [
  { day: "Mon", minutes: 24 },
  { day: "Tue", minutes: 22 },
  { day: "Wed", minutes: 26 },
  { day: "Thu", minutes: 21 },
  { day: "Fri", minutes: 20 },
  { day: "Sat", minutes: 23 },
  { day: "Sun", minutes: 19 },
];

export default function MRIDashboard() {
  return (
    <DepartmentDashboard
      title="MRI Dashboard"
      subtitle="Today's MRI Workflow"
      description="Manage MRI studies, verification and reports."
      icon={<MedicalServicesOutlinedIcon />}
      stats={stats}
      trendData={trendData}
      statusData={statusData}
      reportingData={reportingData}
      chartConfig={{
        trendTitle: "MRI Study Volume",
        trendSubtitle: "Today's MRI studies",
        statusTitle: "MRI Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "MRI Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={mriRows}
      onVerify={(row) => {
        console.log("Verify MRI Report", row.id);
      }}
      onViewReport={(row) => {
        console.log("Open MRI Report", row.id);
      }}
      onRefresh={() => {
        console.log("Refresh MRI Dashboard");
      }}
      onExport={() => {
        console.log("Export MRI Reports");
      }}
    />
  );
}