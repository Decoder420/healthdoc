"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { MetricCard, ChartWrapper, Badge, StatusChip } from "@/components/ui";
import type { StatusKind } from "@/components/ui";
import { QuickActions } from "@/components/dashboard/receptionist/quick-actions";
import LineChart from "@/components/dashboard/lab/Lab_LineCharts";
import UrgencyPieChart from "@/components/dashboard/lab/Lab_Urgency_Pi_Chart";
import CalendarComponent from "@/components/dashboard/lab/Lab_Calendar";
import LabWorkflowOverview from "@/components/dashboard/lab-technician/labworkflow";
import { patients } from "@/lib/mock/lab_data";
import {
  getLabDashboardMetrics,
  getLabQueueRows,
  labQuickActions,
} from "@/features/lab/dashboard-data";


import dayjs from "dayjs";

type LabTechnicianDashboardProps = {
  userName?: string;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function priorityToStatus(priority: string): StatusKind {
  const p = priority.toLowerCase();
  if (p === "emergency") return "rejected";
  if (p === "urgent") return "pending";
  return "scheduled";
}

function statusToChip(status: string): StatusKind {
  const s = status.toUpperCase();
  if (s === "QUEUE") return "waiting";
  if (s === "IN_PROCESS" || s === "PROCESSING") return "in_progress";
  if (s === "VERIFIED" || s === "COMPLETED") return "completed";
  if (s === "REJECTED") return "rejected";
  return "pending";
}

export function LabTechnicianDashboard({
  userName = "Technician",
}: LabTechnicianDashboardProps) {
 const [selectedDate, setSelectedDate] = useState(
  dayjs().format("YYYY-MM-DD")
);
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
  return patients.filter((item) => {
    const matchesDate =
      item.order.orderedAt.slice(0, 10) === selectedDate;

    const query = search.toLowerCase().trim();

    const matchesSearch =
      query === "" ||
      item.patient.name.toLowerCase().includes(query) ||
      item.patient.uhid.toLowerCase().includes(query) ||
      item.patient.patientId.toLowerCase().includes(query) ||
      item.doctor.name.toLowerCase().includes(query);

    return matchesDate && matchesSearch;
  });
}, [selectedDate, search]);

  const metrics = useMemo(
    () => getLabDashboardMetrics(filteredPatients.length ? filteredPatients : patients),
    [filteredPatients]
  );

  const queueRows = useMemo(
    () => getLabQueueRows(filteredPatients.length ? filteredPatients : patients, 8),
    [filteredPatients]
  );

  const metricCards = [
    {
      label: "In Queue",
      value: metrics.inQueue,
      delta: `${metrics.totalOrders} orders today`,
      icon: <PendingActionsRoundedIcon />,
    },
    {
      label: "Samples Collected",
      value: metrics.samplesCollected,
      delta: "+12 from yesterday",
      deltaPositive: true,
      icon: <ScienceRoundedIcon />,
    },
    {
      label: "In Process",
      value: metrics.inProcess,
      delta: "Analyzers active",
      icon: <BiotechRoundedIcon />,
    },
    {
      label: "Rejected",
      value: metrics.rejected,
      delta: "Needs recollection",
      deltaPositive: false,
      icon: <CancelRoundedIcon />,
    },
    {
      label: "Reports Released",
      value: metrics.reportsReleased,
      delta: "+8 this shift",
      deltaPositive: true,
      icon: <DescriptionRoundedIcon />,
    },
    {
      label: "Critical Alerts",
      value: metrics.criticalAlerts,
      delta: `${metrics.emergency} emergency`,
      deltaPositive: false,
      icon: <WarningAmberRoundedIcon />,
    },
  ];

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Badge>Pathology</Badge>
          <Badge variant="muted">Lab Employee</Badge>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {getGreeting()}, {userName}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Today's pathology overview · {formatDate()}
        </p>
      </div>

      <div className="surface-muted flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>

        Lab open · Shift 08:00 – 20:00
      </div>
    </div>

    {/* KPI Cards */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metricCards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>

    {/* Quick Actions */}
    <div>
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Quick Actions
      </h2>

      <QuickActions actions={labQuickActions} />
    </div>

    <LabWorkflowOverview />

  {/* Charts */}
{/* Charts */}
<div className="flex flex-col gap-6 lg:flex-row">

  {/* Line Chart - 40% */}
  <div className="lg:w-[40%]">
    <ChartWrapper
      title="Patient inflow by hour"
      description={`Orders on ${selectedDate}`}
      height={320}
      empty={filteredPatients.length === 0}
      emptyMessage="No orders for the selected date."
    >
      <LineChart patients={filteredPatients} />
    </ChartWrapper>
  </div>

  {/* Priority Chart - 30% */}
  <div className="lg:w-[30%]">
    <ChartWrapper
      title="Priority mix"
      description={`${metrics.urgent} urgent · ${metrics.emergency} emergency`}
      empty={filteredPatients.length === 0}
    >
      <UrgencyPieChart patients={filteredPatients} />
    </ChartWrapper>
  </div>

  {/* Calendar - 30% */}
  <div className="lg:w-[30%]">
    <ChartWrapper
      title="Filter by date"
      description="Charts and queue update for the selected day."
      height={320}
    >
      <div className="flex h-full items-center justify-center">
        <CalendarComponent
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </ChartWrapper>
  </div>

</div>

      {/* Pending queue table */}
      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Priority test queue
            </h2>
            <p className="text-xs text-muted-foreground">
              Highest priority orders first
            </p>
          </div>
          <Link href="/lab/test_queue" className="link-primary text-sm">
            Open full queue →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Tests</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Ordered</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {queueRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border hover:bg-muted/40"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/lab/patient/${row.patientId}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {row.patientName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {row.uhid} · {row.patientId}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{row.tests}</td>
                  <td className="px-5 py-3">
                    <StatusChip
                      status={priorityToStatus(row.priority)}
                      label={row.priority}
                    />
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {formatTime(row.orderedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusChip status={statusToChip(row.status)} />
                  </td>
                </tr>
              ))}
              {queueRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    No pending lab orders for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
