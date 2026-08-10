"use client";

import type { HospitalReportsBundle, ReportTabId } from "@/features/reports/types";
import { ReportKpiGrid } from "@/components/reports/report-kpi-grid";
import { ReportBarChart } from "@/components/reports/report-bar-chart";
import { ReportBreakdownTable } from "@/components/reports/report-breakdown-table";

type ReportPanelsProps = {
  tab: ReportTabId;
  reports: HospitalReportsBundle;
};

export function ReportPanels({ tab, reports }: ReportPanelsProps) {
  if (tab === "overview") {
    const { overview } = reports;
    return (
      <div className="space-y-6">
        <ReportKpiGrid kpis={overview.kpis} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportBarChart
            title="Daily visit trend"
            description="OPD / appointment activity over the selected window"
            data={overview.dailyVisits}
          />
          <ReportBreakdownTable
            title="Department load"
            description="Appointments by department"
            rows={overview.departmentLoad}
            valueLabel="Visits"
          />
        </div>
      </div>
    );
  }

  if (tab === "patients") {
    const { patients } = reports;
    return (
      <div className="space-y-6">
        <ReportKpiGrid kpis={patients.kpis} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportBreakdownTable
            title="Gender distribution"
            rows={patients.byGender}
          />
          <ReportBreakdownTable
            title="Identity coverage"
            rows={patients.identityCoverage}
          />
        </div>
        <ReportBreakdownTable
          title="Recent registrations"
          description="Newest patient records in the registry"
          rows={patients.recentRegistrations}
          valueLabel="Age"
        />
      </div>
    );
  }

  if (tab === "appointments") {
    const { appointments } = reports;
    return (
      <div className="space-y-6">
        <ReportKpiGrid kpis={appointments.kpis} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportBarChart
            title="Appointments by day"
            data={appointments.daily}
          />
          <ReportBreakdownTable
            title="Status breakdown"
            rows={appointments.byStatus}
          />
        </div>
        <ReportBreakdownTable
          title="Doctor workload"
          description="Appointments handled in the selected period"
          rows={appointments.byDoctor}
          valueLabel="Visits"
        />
      </div>
    );
  }

  if (tab === "doctors") {
    const { doctors } = reports;
    return (
      <div className="space-y-6">
        <ReportKpiGrid kpis={doctors.kpis} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportBreakdownTable
            title="Doctors by department"
            rows={doctors.byDepartment}
          />
          <ReportBreakdownTable
            title="Availability status"
            rows={doctors.byStatus}
          />
        </div>
        <ReportBreakdownTable
          title="Appointment workload"
          rows={doctors.workload}
          valueLabel="Visits"
        />
      </div>
    );
  }

  if (tab === "ipd") {
    const { ipd } = reports;
    return (
      <div className="space-y-6">
        <ReportKpiGrid kpis={ipd.kpis} />
        <div className="grid gap-6 xl:grid-cols-2">
          <ReportBreakdownTable
            title="Request status"
            rows={ipd.byStatus}
          />
          <ReportBreakdownTable
            title="Nurse load"
            rows={ipd.nurseLoad}
            valueLabel="Active"
          />
        </div>
        <ReportBreakdownTable
          title="Bed occupancy"
          description="1 = occupied, 0 = free / other"
          rows={ipd.bedOccupancy}
          valueLabel="Occupied"
        />
      </div>
    );
  }

  const { revenue } = reports;
  return (
    <div className="space-y-6">
      <ReportKpiGrid kpis={revenue.kpis} />
      <div className="grid gap-6 xl:grid-cols-2">
        <ReportBarChart
          title="Estimated daily revenue"
          description="Consult fee + OPD token (demo estimate)"
          data={revenue.dailyRevenue}
          valuePrefix="₹"
        />
        <ReportBreakdownTable
          title="Fee sources"
          rows={revenue.feeSources}
          valueLabel="Amount"
          formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
        />
      </div>
      <ReportBreakdownTable
        title="Revenue by department"
        rows={revenue.byDepartment}
        valueLabel="Amount"
        formatValue={(value) => `₹${value.toLocaleString("en-IN")}`}
      />
    </div>
  );
}
