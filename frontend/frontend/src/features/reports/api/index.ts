import { getAllAppointments } from "@/features/appointments/api";
import { todayIsoDate } from "@/features/appointments/data/mock-appointments";
import { getAllDoctors } from "@/features/doctors/api";
import {
  getAllIpdBeds,
  getAllIpdNurses,
  getAllIpdRequests,
  getIpdOpsStats,
} from "@/features/ipd/api";
import { OPD_TOKEN_FEE } from "@/features/opd/types";
import { getAllPatients } from "@/features/patients/api";
import type {
  AppointmentsReport,
  DoctorsReport,
  HospitalReportsBundle,
  IpdReport,
  OverviewReport,
  PatientsReport,
  ReportPeriod,
  ReportSeriesPoint,
  RevenueReport,
} from "@/features/reports/types";

function isoDateOffset(daysFromToday: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

function formatShortDay(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
  });
}

function inPeriod(isoDate: string, period: ReportPeriod) {
  if (period === "all") return true;
  const today = todayIsoDate();
  if (period === "today") return isoDate === today;
  const days = period === "7d" ? 7 : 30;
  const min = isoDateOffset(1 - days);
  return isoDate >= min && isoDate <= today;
}

/** Deterministic demo trend so charts always have history even with sparse live data. */
function seededDailySeries(days: number, base: number, variance: number): ReportSeriesPoint[] {
  const points: ReportSeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = isoDateOffset(-i);
    const wave = Math.round(Math.sin(i * 0.9) * variance + (i % 3) * 2);
    points.push({
      label: formatShortDay(date),
      value: Math.max(0, base + wave),
    });
  }
  return points;
}

function buildOverview(period: ReportPeriod): OverviewReport {
  const patients = getAllPatients();
  const appointments = getAllAppointments().filter((item) =>
    inPeriod(item.date, period),
  );
  const doctors = getAllDoctors();
  const ipd = getIpdOpsStats();

  const completed = appointments.filter((item) => item.status === "completed").length;
  const today = todayIsoDate();
  const registeredToday = patients.filter(
    (patient) => patient.registeredAt.slice(0, 10) === today,
  ).length;

  const deptMap = new Map<string, number>();
  for (const item of appointments) {
    deptMap.set(item.department, (deptMap.get(item.department) ?? 0) + 1);
  }

  const liveDaily = seededDailySeries(period === "30d" ? 14 : 7, 18, 6).map(
    (point, index, arr) => {
      if (index === arr.length - 1) {
        return {
          ...point,
          value: Math.max(point.value, appointments.filter((a) => a.date === today).length),
        };
      }
      return point;
    },
  );

  return {
    kpis: [
      {
        label: "Patients",
        value: patients.length,
        hint: `${registeredToday} registered today`,
      },
      {
        label: "Appointments",
        value: appointments.length,
        hint: `${completed} completed in period`,
      },
      {
        label: "Active Doctors",
        value: doctors.filter((d) => d.status === "active").length,
        hint: `${doctors.length} total profiles`,
      },
      {
        label: "IPD Pending",
        value: ipd.pendingRequests,
        hint: `${ipd.availableBeds} beds free`,
      },
    ],
    dailyVisits: liveDaily,
    departmentLoad: [...deptMap.entries()]
      .map(([label, value]) => ({
        id: label,
        label,
        value,
        meta: "appointments",
      }))
      .sort((a, b) => b.value - a.value),
  };
}

function buildPatientsReport(): PatientsReport {
  const patients = getAllPatients();
  const withAbha = patients.filter((p) => Boolean(p.abha)).length;
  const withAadhaar = patients.filter((p) => Boolean(p.aadhaar)).length;
  const today = todayIsoDate();
  const registeredToday = patients.filter(
    (p) => p.registeredAt.slice(0, 10) === today,
  ).length;

  const genderMap = new Map<string, number>();
  for (const patient of patients) {
    genderMap.set(patient.gender, (genderMap.get(patient.gender) ?? 0) + 1);
  }

  return {
    kpis: [
      { label: "Total Patients", value: patients.length, hint: "Registry size" },
      { label: "Registered Today", value: registeredToday, hint: "New records" },
      {
        label: "ABHA Linked",
        value: withAbha,
        hint:
          patients.length > 0
            ? `${Math.round((withAbha / patients.length) * 100)}% coverage`
            : "No data",
      },
      {
        label: "Aadhaar Linked",
        value: withAadhaar,
        hint:
          patients.length > 0
            ? `${Math.round((withAadhaar / patients.length) * 100)}% coverage`
            : "No data",
      },
    ],
    byGender: [...genderMap.entries()].map(([label, value]) => ({
      id: label,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
    })),
    recentRegistrations: [...patients]
      .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
      .slice(0, 8)
      .map((patient) => ({
        id: patient.uhid,
        label: patient.name,
        secondary: patient.uhid,
        value: patient.age,
        meta: new Date(patient.registeredAt).toLocaleDateString("en-IN"),
      })),
    identityCoverage: [
      { id: "abha", label: "With ABHA", value: withAbha },
      { id: "no-abha", label: "Without ABHA", value: patients.length - withAbha },
      { id: "aadhaar", label: "With Aadhaar", value: withAadhaar },
      {
        id: "no-aadhaar",
        label: "Without Aadhaar",
        value: patients.length - withAadhaar,
      },
    ],
  };
}

function buildAppointmentsReport(period: ReportPeriod): AppointmentsReport {
  const all = getAllAppointments();
  const appointments = all.filter((item) => inPeriod(item.date, period));
  const statusMap = new Map<string, number>();
  const doctorMap = new Map<string, { name: string; count: number }>();

  for (const item of appointments) {
    statusMap.set(item.status, (statusMap.get(item.status) ?? 0) + 1);
    const current = doctorMap.get(item.doctorId) ?? {
      name: item.doctorName,
      count: 0,
    };
    current.count += 1;
    doctorMap.set(item.doctorId, current);
  }

  const days = period === "30d" ? 14 : period === "today" ? 1 : 7;
  const dailyCounts = new Map<string, number>();
  for (let i = days - 1; i >= 0; i -= 1) {
    dailyCounts.set(isoDateOffset(-i), 0);
  }
  for (const item of appointments) {
    if (dailyCounts.has(item.date)) {
      dailyCounts.set(item.date, (dailyCounts.get(item.date) ?? 0) + 1);
    }
  }

  return {
    kpis: [
      { label: "Total", value: appointments.length, hint: "In selected period" },
      {
        label: "Completed",
        value: statusMap.get("completed") ?? 0,
        hint: "Finished visits",
      },
      {
        label: "Scheduled",
        value: statusMap.get("scheduled") ?? 0,
        hint: "Upcoming / waiting",
      },
      {
        label: "Cancelled / No-show",
        value: (statusMap.get("cancelled") ?? 0) + (statusMap.get("no-show") ?? 0),
        hint: "Lost slots",
      },
    ],
    byStatus: [...statusMap.entries()].map(([id, value]) => ({
      id,
      label: id.replace("-", " "),
      value,
    })),
    byDoctor: [...doctorMap.entries()]
      .map(([id, data]) => ({
        id,
        label: data.name,
        value: data.count,
        meta: "appointments",
      }))
      .sort((a, b) => b.value - a.value),
    daily: [...dailyCounts.entries()].map(([date, value]) => ({
      label: formatShortDay(date),
      value,
    })),
  };
}

function buildDoctorsReport(period: ReportPeriod): DoctorsReport {
  const doctors = getAllDoctors();
  const appointments = getAllAppointments().filter((item) =>
    inPeriod(item.date, period),
  );

  const deptMap = new Map<string, number>();
  const statusMap = new Map<string, number>();
  for (const doctor of doctors) {
    deptMap.set(doctor.department, (deptMap.get(doctor.department) ?? 0) + 1);
    statusMap.set(doctor.status, (statusMap.get(doctor.status) ?? 0) + 1);
  }

  const workloadMap = new Map<string, { name: string; count: number; dept: string }>();
  for (const item of appointments) {
    const current = workloadMap.get(item.doctorId) ?? {
      name: item.doctorName,
      count: 0,
      dept: item.department,
    };
    current.count += 1;
    workloadMap.set(item.doctorId, current);
  }

  return {
    kpis: [
      { label: "Doctors", value: doctors.length, hint: "All profiles" },
      {
        label: "Active",
        value: statusMap.get("active") ?? 0,
        hint: "Available for OPD",
      },
      {
        label: "On Leave",
        value: statusMap.get("on_leave") ?? 0,
        hint: "Temporarily unavailable",
      },
      {
        label: "Avg Fee",
        value:
          doctors.length > 0
            ? `₹${Math.round(
                doctors.reduce((sum, d) => sum + d.consultationFee, 0) /
                  doctors.length,
              )}`
            : "₹0",
        hint: "Consultation fee average",
      },
    ],
    byDepartment: [...deptMap.entries()]
      .map(([label, value]) => ({ id: label, label, value }))
      .sort((a, b) => b.value - a.value),
    byStatus: [...statusMap.entries()].map(([id, value]) => ({
      id,
      label: id.replace("_", " "),
      value,
    })),
    workload: [...workloadMap.entries()]
      .map(([id, data]) => ({
        id,
        label: data.name,
        secondary: data.dept,
        value: data.count,
        meta: "visits",
      }))
      .sort((a, b) => b.value - a.value),
  };
}

function buildIpdReport(): IpdReport {
  const requests = getAllIpdRequests();
  const beds = getAllIpdBeds();
  const nurses = getAllIpdNurses();
  const stats = getIpdOpsStats();

  const statusMap = new Map<string, number>();
  for (const item of requests) {
    statusMap.set(item.status, (statusMap.get(item.status) ?? 0) + 1);
  }

  return {
    kpis: [
      { label: "Pending", value: stats.pendingRequests, hint: "Need assignment" },
      { label: "Active Care", value: stats.activeCare, hint: "Assigned / in progress" },
      { label: "Beds Free", value: stats.availableBeds, hint: `${stats.occupiedBeds} occupied` },
      { label: "Nurses Free", value: stats.availableNurses, hint: "Ready for duty" },
    ],
    byStatus: [...statusMap.entries()].map(([id, value]) => ({
      id,
      label: id.replace("_", " "),
      value,
    })),
    bedOccupancy: beds.map((bed) => ({
      id: bed.id,
      label: bed.label,
      secondary: bed.ward,
      value: bed.status === "occupied" ? 1 : 0,
      meta: bed.status,
    })),
    nurseLoad: nurses.map((nurse) => ({
      id: nurse.id,
      label: nurse.name,
      secondary: nurse.ward,
      value: nurse.activeAssignments,
      meta: nurse.status.replace("_", " "),
    })),
  };
}

function buildRevenueReport(period: ReportPeriod): RevenueReport {
  const appointments = getAllAppointments().filter((item) =>
    inPeriod(item.date, period),
  );
  const doctors = getAllDoctors();
  const feeByDoctor = new Map(doctors.map((d) => [d.id, d.consultationFee]));

  let consultRevenue = 0;
  const deptRevenue = new Map<string, number>();

  for (const item of appointments) {
    if (item.status === "cancelled" || item.status === "no-show") continue;
    const fee = feeByDoctor.get(item.doctorId) ?? 500;
    const token = OPD_TOKEN_FEE;
    const total = fee + token;
    consultRevenue += total;
    deptRevenue.set(
      item.department,
      (deptRevenue.get(item.department) ?? 0) + total,
    );
  }

  const days = period === "30d" ? 14 : period === "today" ? 1 : 7;
  const daily = seededDailySeries(days, Math.max(8, Math.round(consultRevenue / Math.max(days, 1) / 100)), 4).map(
    (point, index, arr) => ({
      label: point.label,
      value:
        index === arr.length - 1 && period !== "all"
          ? Math.max(point.value * 100, Math.round(consultRevenue / Math.max(days, 1)))
          : point.value * 100,
    }),
  );

  const billable = appointments.filter(
    (item) => item.status !== "cancelled" && item.status !== "no-show",
  ).length;

  return {
    kpis: [
      {
        label: "Estimated Revenue",
        value: `₹${consultRevenue.toLocaleString("en-IN")}`,
        hint: "Consult fee + OPD token",
      },
      {
        label: "Billable Visits",
        value: billable,
        hint: "Excludes cancelled / no-show",
      },
      {
        label: "Avg Ticket",
        value:
          billable > 0
            ? `₹${Math.round(consultRevenue / billable).toLocaleString("en-IN")}`
            : "₹0",
        hint: "Per visit average",
      },
      {
        label: "Token Fees",
        value: `₹${(billable * OPD_TOKEN_FEE).toLocaleString("en-IN")}`,
        hint: `₹${OPD_TOKEN_FEE} × visits`,
      },
    ],
    dailyRevenue: daily,
    byDepartment: [...deptRevenue.entries()]
      .map(([label, value]) => ({
        id: label,
        label,
        value,
        meta: "₹",
      }))
      .sort((a, b) => b.value - a.value),
    feeSources: [
      {
        id: "consult",
        label: "Consultation fees",
        value: Math.max(0, consultRevenue - billable * OPD_TOKEN_FEE),
      },
      {
        id: "token",
        label: "OPD token fees",
        value: billable * OPD_TOKEN_FEE,
      },
    ],
  };
}

export function getHospitalReports(
  period: ReportPeriod = "7d",
): HospitalReportsBundle {
  return {
    generatedAt: new Date().toISOString(),
    period,
    overview: buildOverview(period),
    patients: buildPatientsReport(),
    appointments: buildAppointmentsReport(period),
    doctors: buildDoctorsReport(period),
    ipd: buildIpdReport(),
    revenue: buildRevenueReport(period),
  };
}

export function reportsToCsv(
  title: string,
  rows: { label: string; value: string | number; meta?: string }[],
) {
  const header = "Label,Value,Meta";
  const body = rows
    .map((row) =>
      [`"${row.label.replace(/"/g, '""')}"`, row.value, `"${(row.meta ?? "").replace(/"/g, '""')}"`].join(","),
    )
    .join("\n");
  return `${title}\n${header}\n${body}\n`;
}

export function downloadCsv(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export type ReportExportRow = {
  label: string;
  value: string | number;
  meta?: string;
};

export function downloadExcel(
  filename: string,
  sheetName: string,
  title: string,
  rows: ReportExportRow[],
) {
  if (typeof window === "undefined") return;

  // Dynamic import keeps this client-only.
  void import("xlsx").then((XLSX) => {
    const sheetRows = [
      [title],
      [],
      ["Label", "Value", "Meta"],
      ...rows.map((row) => [row.label, row.value, row.meta ?? ""]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
    worksheet["!cols"] = [{ wch: 28 }, { wch: 18 }, { wch: 36 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
    XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  });
}

