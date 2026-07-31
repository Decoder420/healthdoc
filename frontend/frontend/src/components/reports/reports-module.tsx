"use client";

import { useMemo, useState } from "react";
import {
  downloadCsv,
  downloadExcel,
  getHospitalReports,
  reportsToCsv,
  type ReportExportRow,
} from "@/features/reports/api";
import type {
  HospitalReportsBundle,
  ReportPeriod,
  ReportTabId,
} from "@/features/reports/types";
import { REPORT_TAB_LABELS } from "@/features/reports/types";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTabs } from "@/components/reports/report-tabs";
import { ReportPanels } from "@/components/reports/report-panels";

function collectExportRows(
  reports: HospitalReportsBundle,
  tab: ReportTabId,
): ReportExportRow[] {
  const section =
    tab === "overview"
      ? reports.overview
      : tab === "patients"
        ? reports.patients
        : tab === "appointments"
          ? reports.appointments
          : tab === "doctors"
            ? reports.doctors
            : tab === "ipd"
              ? reports.ipd
              : reports.revenue;

  const rows: ReportExportRow[] = [
    ...section.kpis.map((kpi) => ({
      label: kpi.label,
      value: kpi.value,
      meta: kpi.hint,
    })),
  ];

  if ("departmentLoad" in section) {
    rows.push(
      ...section.departmentLoad.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("byStatus" in section) {
    rows.push(
      ...section.byStatus.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("byDepartment" in section) {
    rows.push(
      ...section.byDepartment.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("byDoctor" in section) {
    rows.push(
      ...section.byDoctor.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("feeSources" in section) {
    rows.push(
      ...section.feeSources.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("workload" in section) {
    rows.push(
      ...section.workload.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("bedOccupancy" in section) {
    rows.push(
      ...section.bedOccupancy.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }
  if ("nurseLoad" in section) {
    rows.push(
      ...section.nurseLoad.map((row) => ({
        label: row.label,
        value: row.value,
        meta: row.meta,
      })),
    );
  }

  return rows;
}

export function ReportsModule() {
  const [period, setPeriod] = useState<ReportPeriod>("7d");
  const [tab, setTab] = useState<ReportTabId>("overview");
  const [tick, setTick] = useState(0);

  const reports = useMemo(() => {
    void tick;
    return getHospitalReports(period);
  }, [period, tick]);

  function handleExportCsv() {
    const rows = collectExportRows(reports, tab);
    const title = `healthdoc ${REPORT_TAB_LABELS[tab]} Report (${period})`;
    const csv = reportsToCsv(title, rows);
    downloadCsv(`healthdoc-${tab}-${period}.csv`, csv);
  }

  function handleExportExcel() {
    const rows = collectExportRows(reports, tab);
    const title = `healthdoc ${REPORT_TAB_LABELS[tab]} Report (${period})`;
    downloadExcel(
      `healthdoc-${tab}-${period}.xlsx`,
      REPORT_TAB_LABELS[tab],
      title,
      rows,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Reports Module</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Analytics & Operational Reports
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live insights across patients, appointments, doctors, IPD, and revenue.
          Receptionists can export any report as CSV or Excel.
        </p>
      </div>

      <ReportFilters
        period={period}
        onPeriodChange={setPeriod}
        generatedAt={reports.generatedAt}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onRefresh={() => setTick((value) => value + 1)}
      />

      <ReportTabs active={tab} onChange={setTab} />

      <ReportPanels tab={tab} reports={reports} />
    </div>
  );
}
