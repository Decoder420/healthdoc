"use client";

import DepartmentDashboard from "../dashboard/layout";

import type {
  RadiologyCase,
  TrendChartData,
  StatusDistributionData,
  ReportingTimeData,
} from "../dashboard/types";

import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";

const ecgRows: RadiologyCase[] = [
  {
    id: "ECG001",
    patientName: "Rahul Sharma",
    uhid: "UH10001",
    accessionNo: "ACC-ECG-001",
    study: "12 Lead ECG",
    modality: "ECG",
    doctor: "Dr. Mehta",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
  {
    id: "ECG002",
    patientName: "Anita Verma",
    uhid: "UH10002",
    accessionNo: "ACC-ECG-002",
    study: "Stress ECG",
    modality: "ECG",
    doctor: "Dr. Sharma",
    priority: "Urgent",
    status: "VERIFIED",
    studyDate: "2026-07-25",
  },
  {
    id: "ECG003",
    patientName: "Mohit Singh",
    uhid: "UH10003",
    accessionNo: "ACC-ECG-003",
    study: "Holter ECG",
    modality: "ECG",
    doctor: "Dr. Kapoor",
    priority: "STAT",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },
];

const stats = [
  {
    title: "Total ECG Cases",
    text: 68,
  },
  {
    title: "Processing",
    text: 11,
  },
  {
    title: "Verified",
    text: 57,
  },
  {
    title: "Average Reporting",
    text: "9 min",
  },
];

const trendData: TrendChartData[] = [
  { label: "08:00", value: 8 },
  { label: "10:00", value: 16 },
  { label: "12:00", value: 25 },
  { label: "14:00", value: 32 },
  { label: "16:00", value: 28 },
  { label: "18:00", value: 19 },
];

const statusData: StatusDistributionData[] = [
  {
    name: "Processing",
    value: 11,
  },
  {
    name: "Verified",
    value: 57,
  },
];

const reportingData: ReportingTimeData[] = [
  { day: "Mon", minutes: 9 },
  { day: "Tue", minutes: 8 },
  { day: "Wed", minutes: 10 },
  { day: "Thu", minutes: 9 },
  { day: "Fri", minutes: 8 },
  { day: "Sat", minutes: 7 },
  { day: "Sun", minutes: 8 },
];

export default function ECGDashboard() {
  return (
    <DepartmentDashboard
      title="ECG Dashboard"
      subtitle="Today's ECG Workflow"
      description="Manage ECG studies, verification and reports."
      icon={<MonitorHeartOutlinedIcon />}
      stats={stats}
      trendData={trendData}
      statusData={statusData}
      reportingData={reportingData}
      chartConfig={{
        trendTitle: "ECG Study Volume",
        trendSubtitle: "Today's ECG studies",
        statusTitle: "ECG Report Status",
        statusSubtitle: "Processing vs Verified",
        reportingTitle: "ECG Reporting Time",
        reportingSubtitle: "Last 7 days",
      }}
      rows={ecgRows}
      onVerify={(row) => {
        console.log("Verify ECG Report", row.id);
      }}
      onViewReport={(row) => {
        console.log("View ECG Report", row.id);
      }}
      onRefresh={() => {
        console.log("Refresh ECG Dashboard");
      }}
      onExport={() => {
        console.log("Export ECG Reports");
      }}
    />
  );
}