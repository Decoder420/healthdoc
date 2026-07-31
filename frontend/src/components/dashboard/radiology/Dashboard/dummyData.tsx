import {
  Assignment,
  CheckCircle,
  PendingActions,
  Warning,
  LocalHospital,
  AddCircle,
  PlayArrow,
  Verified,
  Print,
  FileDownload,
} from "@mui/icons-material";

import {
  appointmentQueue as heavyQueue,
  getRadiologyModalityDistribution,
  getRadiologyQueueStats,
} from "@/components/dashboard/radiology/test_queue/DummyData";

import {
  AppointmentQueue,
  CriticalAlert,
  DashboardSummary,
  ImagingTrendData,
  KPICardData,
  MachineUtilization,
  Modality,
  ModalityCard,
  ModalityDistribution,
  QuickAction,
  RecentReport,
  WorkflowStep,
} from "./types";

const queueStats = getRadiologyQueueStats(heavyQueue);
const verifiedCount = heavyQueue.filter(
  (item) => item.status === "Verified",
).length;

function toDashboardModality(modality: string): Modality {
  if (modality === "USG") return "Ultrasound";
  return modality as Modality;
}

export const dashboardSummary: DashboardSummary = {
  totalOrders: queueStats.total,
  pendingReports: queueStats.reporting,
  completedReports: queueStats.completed,
  verifiedReports: verifiedCount,
  cancelledOrders: 4,
  criticalCases: queueStats.emergency,
};

export const kpiCards: KPICardData[] = [
  {
    id: 1,
    title: "Today's Orders",
    value: queueStats.total,
    subtitle: "+12% from yesterday",
    trend: 12,
    icon: <Assignment color="primary" />,
  },
  {
    id: 2,
    title: "Pending Reports",
    value: queueStats.reporting,
    subtitle: "Awaiting reporting",
    trend: -4,
    icon: <PendingActions color="warning" />,
  },
  {
    id: 3,
    title: "Completed Scans",
    value: queueStats.completed,
    subtitle: "Today's completed studies",
    trend: 8,
    icon: <CheckCircle color="success" />,
  },
  {
    id: 4,
    title: "Verified Reports",
    value: verifiedCount,
    subtitle: "Ready for release",
    trend: 5,
    icon: <Verified color="success" />,
  },
  {
    id: 5,
    title: "Critical Cases",
    value: queueStats.emergency,
    subtitle: "Needs immediate review",
    trend: 2,
    icon: <Warning color="error" />,
  },
  {
    id: 6,
    title: "Active Machines",
    value: 10,
    subtitle: "Operational",
    trend: 0,
    icon: <LocalHospital color="info" />,
  },
];

export const imagingTrend: ImagingTrendData[] = [
  { day: "Mon", xray: 48, ct: 22, mri: 16, ultrasound: 28 },
  { day: "Tue", xray: 54, ct: 25, mri: 18, ultrasound: 30 },
  { day: "Wed", xray: 51, ct: 28, mri: 17, ultrasound: 32 },
  { day: "Thu", xray: 60, ct: 30, mri: 20, ultrasound: 35 },
  { day: "Fri", xray: 57, ct: 27, mri: 18, ultrasound: 31 },
  { day: "Sat", xray: 46, ct: 21, mri: 14, ultrasound: 24 },
  { day: "Sun", xray: 38, ct: 17, mri: 12, ultrasound: 20 },
];

export const modalityDistribution: ModalityDistribution[] =
  getRadiologyModalityDistribution(heavyQueue).map((item, index) => ({
    id: index,
    label: toDashboardModality(item.name),
    value: item.value,
  }));

export const machineUtilization: MachineUtilization[] = [
  { machine: "MRI Scanner", utilization: 92 },
  { machine: "CT Scanner 01", utilization: 88 },
  { machine: "CT Scanner 02", utilization: 76 },
  { machine: "Digital X-Ray A", utilization: 71 },
  { machine: "Digital X-Ray B", utilization: 64 },
  { machine: "Ultrasound 01", utilization: 74 },
  { machine: "Ultrasound 02", utilization: 58 },
  { machine: "Mammography", utilization: 55 },
  { machine: "ECG Station", utilization: 42 },
];

export const appointmentQueue: AppointmentQueue[] = heavyQueue
  .slice(0, 24)
  .map((item) => ({
    id: item.id,
    token: item.token,
    patientName: item.patientName,
    uhid: item.uhid,
    age: item.age,
    gender: item.gender,
    modality: toDashboardModality(item.modality),
    procedure: item.procedure,
    radiologist: item.radiologist,
    appointmentTime: item.appointmentTime,
    priority: item.priority,
    status:
      item.status === "Queue"
        ? "Waiting"
        : item.status === "In Progress"
          ? "In Progress"
          : item.status === "Reporting"
            ? "Scheduled"
            : "Completed",
  }));

export const recentReports: RecentReport[] = heavyQueue
  .filter((item) =>
    ["Completed", "Verified", "Reporting"].includes(item.status),
  )
  .slice(0, 24)
  .map((item, index) => ({
    id: index + 1,
    reportId: `REP${240000 + item.id}`,
    patientName: item.patientName,
    uhid: item.uhid,
    modality: toDashboardModality(item.modality),
    procedure: item.procedure,
    radiologist: item.radiologist,
    reportDate: item.appointmentDate,
    status:
      item.status === "Verified"
        ? "Verified"
        : item.status === "Reporting"
          ? "Pending Verification"
          : "Draft",
  }));

export const criticalAlerts: CriticalAlert[] = heavyQueue
  .filter((item) => item.priority === "Emergency")
  .slice(0, 12)
  .map((item, index) => ({
    id: index + 1,
    title: `Critical ${item.modality} — ${item.procedure}`,
    description: `${item.patientName} (${item.uhid}) needs immediate radiologist review.`,
    severity: (index % 3 === 0
      ? "High"
      : index % 3 === 1
        ? "Medium"
        : "Low") as CriticalAlert["severity"],
    createdAt: `${8 + (index % 40)} mins ago`,
  }));

const avgByModality: Record<string, string> = {
  "X-Ray": "12 min",
  CT: "28 min",
  MRI: "45 min",
  USG: "18 min",
  Mammography: "20 min",
  ECG: "8 min",
};

export const modalityCards: ModalityCard[] = getRadiologyModalityDistribution(
  heavyQueue,
).map((item, index) => {
  const completed = Math.round(item.value * 0.78);
  return {
    id: index + 1,
    modality: toDashboardModality(item.name),
    total: item.value,
    completed,
    pending: item.value - completed,
    averageTime: avgByModality[item.name] ?? "20 min",
  };
});

export const workflowSteps: WorkflowStep[] = [
  { id: 1, label: "Order Received", completed: true },
  { id: 2, label: "Scheduled", completed: true },
  { id: 3, label: "Patient Arrived", completed: true },
  { id: 4, label: "Scan Started", completed: true },
  { id: 5, label: "Reporting", completed: false },
  { id: 6, label: "Verified", completed: false },
  { id: 7, label: "Released", completed: false },
];

export const quickActions: QuickAction[] = [
  {
    id: 1,
    title: "New Order",
    description: "Create imaging request",
    icon: <AddCircle />,
    color: "primary",
  },
  {
    id: 2,
    title: "Start Scan",
    description: "Begin scheduled study",
    icon: <PlayArrow />,
    color: "success",
  },
  {
    id: 3,
    title: "Verify Report",
    description: "Approve report",
    icon: <Verified />,
    color: "warning",
  },
  {
    id: 4,
    title: "Print Report",
    description: "Print patient report",
    icon: <Print />,
    color: "secondary",
  },
  {
    id: 5,
    title: "Export",
    description: "Download reports",
    icon: <FileDownload />,
    color: "info",
  },
];
