"use client";

import DepartmentDashboard from "../dashboard/layout";

import type {
  RadiologyCase,
  TrendChartData,
  StatusDistributionData,
  ReportingTimeData,
} from "../dashboard/types";

import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";

const usgRows: RadiologyCase[] = [
  {
    id: "USG001",
    patientName: "Meera Joshi",
    uhid: "UH30001",
    accessionNo: "ACC-USG-001",
    study: "USG Abdomen",
    modality: "USG",
    doctor: "Dr. Kapoor",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
  {
    id: "USG002",
    patientName: "Sanjay Patil",
    uhid: "UH30002",
    accessionNo: "ACC-USG-002",
    study: "USG Pelvis",
    modality: "USG",
    doctor: "Dr. Mehta",
    priority: "Urgent",
    status: "VERIFIED",
    studyDate: "2026-07-25",
  },
  {
    id: "USG003",
    patientName: "Kavya Iyer",
    uhid: "UH30003",
    accessionNo: "ACC-USG-003",
    study: "Obstetric USG",
    modality: "USG",
    doctor: "Dr. Sharma",
    priority: "STAT",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
];

const stats = [
  { title: "Total USG Cases", text: 42 },
  { title: "Processing", text: 8 },
  { title: "Verified", text: 31 },
  { title: "Average Reporting", text: "18 min" },
];

const trendData: TrendChartData[] = [
  { label: "08:00", value: 4 },
  { label: "10:00", value: 9 },
  { label: "12:00", value: 14 },
  { label: "14:00", value: 20 },
  { label: "16:00", value: 16 },
  { label: "18:00", value: 10 },
];

const statusData: StatusDistributionData[] = [
  { name: "Processing", value: 8 },
  { name: "Verified", value: 31 },
];

const reportingData: ReportingTimeData[] = [
  { day: "Mon", minutes: 18 },
  { day: "Tue", minutes: 17 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 16 },
  { day: "Fri", minutes: 15 },
  { day: "Sat", minutes: 19 },
  { day: "Sun", minutes: 14 },
];

export default function USGDashboard() {
  return (
    <DepartmentDashboard
      title="USG Dashboard"
      subtitle="Today's Ultrasound Workflow"
      description="Manage ultrasound studies, verification and reports."
      icon={<GraphicEqRoundedIcon />}
      stats={stats}
      trendData={trendData}
      statusData={statusData}
      reportingData={reportingData}
      chartConfig={{
        trendTitle: "USG Study Volume",
        trendSubtitle: "Today's ultrasound studies",
        statusTitle: "USG Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "USG Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={usgRows}
      onVerify={(row) => {
        console.log("Verify USG Report", row.id);
      }}
      onViewReport={(row) => {
        console.log("Open USG Report", row.id);
      }}
      onRefresh={() => {
        console.log("Refresh USG Dashboard");
      }}
      onExport={() => {
        console.log("Export USG Reports");
      }}
    />
  );
}
