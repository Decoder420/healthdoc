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
  AppointmentQueue,
  CriticalAlert,
  DashboardSummary,
  ImagingTrendData,
  KPICardData,
  MachineUtilization,
  ModalityCard,
  ModalityDistribution,
  QuickAction,
  RecentReport,
  WorkflowStep,
} from "./types";

export const dashboardSummary: DashboardSummary = {
  totalOrders: 186,
  pendingReports: 18,
  completedReports: 152,
  verifiedReports: 146,
  cancelledOrders: 4,
  criticalCases: 6,
};

export const kpiCards: KPICardData[] = [
  {
    id: 1,
    title: "Today's Orders",
    value: 186,
    subtitle: "+12% from yesterday",
    trend: 12,
    icon: <Assignment color="primary" />,
  },
  {
    id: 2,
    title: "Pending Reports",
    value: 18,
    subtitle: "Awaiting reporting",
    trend: -4,
    icon: <PendingActions color="warning" />,
  },
  {
    id: 3,
    title: "Completed Scans",
    value: 152,
    subtitle: "Today's completed studies",
    trend: 8,
    icon: <CheckCircle color="success" />,
  },
  {
    id: 4,
    title: "Verified Reports",
    value: 146,
    subtitle: "Ready for release",
    trend: 5,
    icon: <Verified color="success" />,
  },
  {
    id: 5,
    title: "Critical Cases",
    value: 6,
    subtitle: "Needs immediate review",
    trend: 2,
    icon: <Warning color="error" />,
  },
  {
    id: 6,
    title: "Active Machines",
    value: 12,
    subtitle: "Operational",
    trend: 0,
    icon: <LocalHospital color="info" />,
  },
];

export const imagingTrend: ImagingTrendData[] = [
  { day: "Mon", xray: 28, ct: 12, mri: 8, ultrasound: 16 },
  { day: "Tue", xray: 34, ct: 15, mri: 10, ultrasound: 18 },
  { day: "Wed", xray: 31, ct: 18, mri: 9, ultrasound: 20 },
  { day: "Thu", xray: 40, ct: 20, mri: 12, ultrasound: 23 },
  { day: "Fri", xray: 37, ct: 17, mri: 10, ultrasound: 19 },
  { day: "Sat", xray: 26, ct: 11, mri: 7, ultrasound: 13 },
  { day: "Sun", xray: 22, ct: 9, mri: 6, ultrasound: 10 },
];

export const modalityDistribution: ModalityDistribution[] = [
  { id: 0, label: "X-Ray", value: 82 },
  { id: 1, label: "CT", value: 36 },
  { id: 2, label: "MRI", value: 24 },
  { id: 3, label: "Ultrasound", value: 34 },
  { id: 4, label: "Mammography", value: 8 },
  { id: 5, label: "ECG", value: 12 },
];

export const machineUtilization: MachineUtilization[] = [
  {
    machine: "MRI Scanner",
    utilization: 92,
  },
  {
    machine: "CT Scanner",
    utilization: 84,
  },
  {
    machine: "Digital X-Ray",
    utilization: 76,
  },
  {
    machine: "Ultrasound",
    utilization: 71,
  },
  {
    machine: "Mammography",
    utilization: 58,
  },
];

export const appointmentQueue: AppointmentQueue[] = [
  {
    id: 1,
    token: "RAD001",
    patientName: "Rahul Sharma",
    uhid: "UH100245",
    age: 36,
    gender: "Male",
    modality: "CT",
    procedure: "CT Brain",
    radiologist: "Dr. Mehta",
    appointmentTime: "09:30 AM",
    priority: "Emergency",
    status: "Waiting",
  },
  {
    id: 2,
    token: "RAD002",
    patientName: "Priya Singh",
    uhid: "UH100312",
    age: 42,
    gender: "Female",
    modality: "MRI",
    procedure: "MRI Spine",
    radiologist: "Dr. Sharma",
    appointmentTime: "10:00 AM",
    priority: "Urgent",
    status: "Scheduled",
  },
  {
    id: 3,
    token: "RAD003",
    patientName: "Amit Verma",
    uhid: "UH100489",
    age: 51,
    gender: "Male",
    modality: "X-Ray",
    procedure: "Chest PA View",
    radiologist: "Dr. Gupta",
    appointmentTime: "10:20 AM",
    priority: "Routine",
    status: "In Progress",
  },
];

export const recentReports: RecentReport[] = [
  {
    id: 1,
    reportId: "REP240001",
    patientName: "Rahul Sharma",
    uhid: "UH100245",
    modality: "CT",
    procedure: "CT Brain",
    radiologist: "Dr. Mehta",
    reportDate: "23 Jul 2026",
    status: "Verified",
  },
  {
    id: 2,
    reportId: "REP240002",
    patientName: "Priya Singh",
    uhid: "UH100312",
    modality: "MRI",
    procedure: "MRI Spine",
    radiologist: "Dr. Sharma",
    reportDate: "23 Jul 2026",
    status: "Pending Verification",
  },
  {
    id: 3,
    reportId: "REP240003",
    patientName: "Amit Verma",
    uhid: "UH100489",
    modality: "X-Ray",
    procedure: "Chest PA View",
    radiologist: "Dr. Gupta",
    reportDate: "23 Jul 2026",
    status: "Draft",
  },
];

export const criticalAlerts: CriticalAlert[] = [
  {
    id: 1,
    title: "Critical CT Brain",
    description: "Immediate radiologist review required.",
    severity: "High",
    createdAt: "10 mins ago",
  },
  {
    id: 2,
    title: "MRI Maintenance",
    description: "Machine scheduled for maintenance tonight.",
    severity: "Medium",
    createdAt: "1 hour ago",
  },
  {
    id: 3,
    title: "Contrast Stock Low",
    description: "Contrast media below reorder level.",
    severity: "Low",
    createdAt: "Today",
  },
];

export const modalityCards: ModalityCard[] = [
  {
    id: 1,
    modality: "X-Ray",
    total: 82,
    completed: 74,
    pending: 8,
    averageTime: "12 min",
  },
  {
    id: 2,
    modality: "CT",
    total: 36,
    completed: 30,
    pending: 6,
    averageTime: "28 min",
  },
  {
    id: 3,
    modality: "MRI",
    total: 24,
    completed: 18,
    pending: 6,
    averageTime: "45 min",
  },
  {
    id: 4,
    modality: "Ultrasound",
    total: 34,
    completed: 29,
    pending: 5,
    averageTime: "18 min",
  },
  {
    id: 5,
    modality: "Mammography",
    total: 8,
    completed: 7,
    pending: 1,
    averageTime: "20 min",
  },
  {
    id: 6,
    modality: "ECG",
    total: 12,
    completed: 12,
    pending: 0,
    averageTime: "8 min",
  },
];

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