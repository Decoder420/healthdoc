"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { ChartWrapper, Badge } from "@/components/ui";

import { QuickActions } from "@/components/dashboard/receptionist/quick-actions";
import LineChart from "@/components/dashboard/lab/Lab_LineCharts";
import UrgencyPieChart from "@/components/dashboard/lab/Lab_Urgency_Pi_Chart";
import CalendarComponent from "@/components/dashboard/lab/Lab_Calendar";
import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";
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

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* KPI Card Types                                                             */
/* -------------------------------------------------------------------------- */

type MetricCard = {
  label: string;
  value: number;
  delta: string;
  deltaPositive?: boolean;
  icon: React.ReactNode;
};

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export function LabTechnicianDashboard({
  userName = "Technician",
}: LabTechnicianDashboardProps) {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  /* ------------------------------------------------------------------------ */
  /* Filter Patients                                                          */
  /* ------------------------------------------------------------------------ */

  const filteredPatients = useMemo(() => {
    return patients.filter((item) => {
      return item.order.orderedAt.slice(0, 10) === selectedDate;
    });
  }, [selectedDate]);

  /* ------------------------------------------------------------------------ */
  /* Metrics                                                                  */
  /* ------------------------------------------------------------------------ */

  const metrics = useMemo(
    () =>
      getLabDashboardMetrics(
        filteredPatients.length ? filteredPatients : patients
      ),
    [filteredPatients]
  );

  /* ------------------------------------------------------------------------ */
  /* Queue                                                                    */
  /* ------------------------------------------------------------------------ */

  const queueRows = useMemo(
    () =>
      getLabQueueRows(
        filteredPatients.length ? filteredPatients : patients,
        8
      ),
    [filteredPatients]
  );

  /* ------------------------------------------------------------------------ */
  /* Dynamic KPI Cards                                                        */
  /* ------------------------------------------------------------------------ */

  const metricCards: MetricCard[] = [
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
    <div className="space-y-5">

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge>Pathology</Badge>

            <Badge variant="muted">
              Lab Employee
            </Badge>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {getGreeting()}, {userName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Today&apos;s pathology overview · {formatDate()}
          </p>
        </div>

        {/* Lab Status */}
        <div className="surface-muted flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />

            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>

          Lab open · Shift 08:00 – 20:00
        </div>
      </div>

      {/* ================================================================== */}
      {/* KPI CARDS                                                          */}
      {/* ================================================================== */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metricCards.map((card) => (
          <DynamicCard
            key={card.label}
            title={card.label}
            text={card.value}
            subtitle={card.delta}
            icon={card.icon}
          />
        ))}
      </div>

      {/* ================================================================== */}
      {/* QUICK ACTIONS                                                      */}
      {/* ================================================================== */}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Quick Actions
        </h2>

        <QuickActions actions={labQuickActions} />
      </div>

      {/* ================================================================== */}
      {/* WORKFLOW                                                           */}
      {/* ================================================================== */}

      <LabWorkflowOverview />

      {/* ================================================================== */}
      {/* CHARTS                                                             */}
      {/* ================================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row">

        {/* Line Chart */}
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

        {/* Priority Chart */}
        <div className="lg:w-[30%]">
          <ChartWrapper
            title="Priority mix"
            description={`${metrics.urgent} urgent · ${metrics.emergency} emergency`}
            empty={filteredPatients.length === 0}
          >
            <UrgencyPieChart patients={filteredPatients} />
          </ChartWrapper>
        </div>

        {/* Calendar */}
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

      {/* ================================================================== */}
      {/* PRIORITY TEST QUEUE                                                */}
      {/* ================================================================== */}

      <div className="surface-card overflow-hidden rounded-xl border border-border">

        {/* ---------------------------------------------------------------- */}
        {/* Queue Header                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-foreground">
                Priority Test Queue
              </h2>

              <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {queueRows.length}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Highest priority orders first
            </p>
          </div>

          <Link
            href="/lab/test_queue"
            className="
              shrink-0
              rounded-md
              px-2.5
              py-1.5
              text-xs
              font-medium
              text-primary
              transition-colors
              hover:bg-muted
            "
          >
            View queue →
          </Link>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Queue Table                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">

            <thead>
              <tr className="border-b border-border bg-muted/30">

                <th
                  scope="col"
                  className="
                    w-[24%]
                    px-5
                    py-3
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Patient
                </th>

                <th
                  scope="col"
                  className="
                    w-[28%]
                    px-5
                    py-3
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Test
                </th>

                <th
                  scope="col"
                  className="
                    w-[14%]
                    px-5
                    py-3
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Priority
                </th>

                <th
                  scope="col"
                  className="
                    w-[14%]
                    px-5
                    py-3
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Ordered
                </th>

                <th
                  scope="col"
                  className="
                    w-[20%]
                    px-5
                    py-3
                    text-left
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-muted-foreground
                  "
                >
                  Status
                </th>

              </tr>
            </thead>

            <tbody>
              {queueRows.map((row) => (
                <tr
                  key={row.id}
                  className="
                    border-b
                    border-border/60
                    last:border-b-0
                    transition-colors
                    hover:bg-muted/20
                  "
                >

                  {/* Patient */}
                  <td className="px-5 py-3.5 align-middle">
                    <Link
                      href={`/lab/patient/${row.patientId}`}
                      className="group inline-flex flex-col"
                    >
                      <span
                        className="
                          text-[13px]
                          font-semibold
                          leading-5
                          text-foreground
                          transition-colors
                          group-hover:text-primary
                        "
                      >
                        {row.patientName}
                      </span>

                      <span className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                        {row.uhid}

                        <span className="mx-1.5 text-muted-foreground/40">
                          •
                        </span>

                        {row.patientId}
                      </span>
                    </Link>
                  </td>

                  {/* Test */}
                  <td className="px-5 py-3.5 align-middle">
                    <p
                      className="
                        max-w-[260px]
                        truncate
                        text-[12px]
                        font-medium
                        leading-5
                        text-foreground
                      "
                      title={row.tests}
                    >
                      {row.tests}
                    </p>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-3.5 align-middle">
                    <span
                      className="
                        text-[12px]
                        font-medium
                        capitalize
                        text-foreground
                      "
                    >
                      {row.priority}
                    </span>
                  </td>

                  {/* Ordered */}
                  <td className="px-5 py-3.5 align-middle">
                    <span
                      className="
                        font-mono
                        text-[11px]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {formatTime(row.orderedAt)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5 align-middle">
                    <span
                      className="
                        text-[12px]
                        font-medium
                        text-foreground
                      "
                    >
                      {row.status}
                    </span>
                  </td>

                </tr>
              ))}

              {/* Empty State */}
              {queueRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">

                      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <PendingActionsRoundedIcon className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <p className="text-[13px] font-semibold text-foreground">
                        No pending lab orders
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        No pending lab orders for this date.
                      </p>

                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Queue Footer                                                     */}
        {/* ---------------------------------------------------------------- */}

        {queueRows.length > 0 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-2.5">
            <span className="text-[11px] text-muted-foreground">
              Showing {queueRows.length}{" "}
              {queueRows.length === 1
                ? "priority order"
                : "priority orders"}
            </span>

            <Link
              href="/lab/test_queue"
              className="
                text-[11px]
                font-medium
                text-muted-foreground
                transition-colors
                hover:text-primary
              "
            >
              Manage queue →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LabTechnicianDashboard;
