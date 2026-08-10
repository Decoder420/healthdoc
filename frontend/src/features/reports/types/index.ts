export type ReportPeriod = "today" | "7d" | "30d" | "all";

export type ReportTabId =
  | "overview"
  | "patients"
  | "appointments"
  | "doctors"
  | "ipd"
  | "revenue";

export type ReportKpi = {
  label: string;
  value: string | number;
  hint: string;
  trend?: string;
};

export type ReportSeriesPoint = {
  label: string;
  value: number;
};

export type ReportBreakdownRow = {
  id: string;
  label: string;
  secondary?: string;
  value: number;
  meta?: string;
};

export type OverviewReport = {
  kpis: ReportKpi[];
  dailyVisits: ReportSeriesPoint[];
  departmentLoad: ReportBreakdownRow[];
};

export type PatientsReport = {
  kpis: ReportKpi[];
  byGender: ReportBreakdownRow[];
  recentRegistrations: ReportBreakdownRow[];
  identityCoverage: ReportBreakdownRow[];
};

export type AppointmentsReport = {
  kpis: ReportKpi[];
  byStatus: ReportBreakdownRow[];
  byDoctor: ReportBreakdownRow[];
  daily: ReportSeriesPoint[];
};

export type DoctorsReport = {
  kpis: ReportKpi[];
  byDepartment: ReportBreakdownRow[];
  byStatus: ReportBreakdownRow[];
  workload: ReportBreakdownRow[];
};

export type IpdReport = {
  kpis: ReportKpi[];
  byStatus: ReportBreakdownRow[];
  bedOccupancy: ReportBreakdownRow[];
  nurseLoad: ReportBreakdownRow[];
};

export type RevenueReport = {
  kpis: ReportKpi[];
  dailyRevenue: ReportSeriesPoint[];
  byDepartment: ReportBreakdownRow[];
  feeSources: ReportBreakdownRow[];
};

export type HospitalReportsBundle = {
  generatedAt: string;
  period: ReportPeriod;
  overview: OverviewReport;
  patients: PatientsReport;
  appointments: AppointmentsReport;
  doctors: DoctorsReport;
  ipd: IpdReport;
  revenue: RevenueReport;
};

export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All time",
};

export const REPORT_TAB_LABELS: Record<ReportTabId, string> = {
  overview: "Overview",
  patients: "Patients",
  appointments: "Appointments",
  doctors: "Doctors",
  ipd: "IPD",
  revenue: "Revenue",
};
