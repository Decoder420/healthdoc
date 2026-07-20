"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  PieChart,
  Users,
} from "lucide-react";

import { patients } from "@/lib/mock/lab_data";

import LineChart from "@/components/dashboard/lab/Lab_LineCharts";
import GenderPieChart from "@/components/dashboard/lab/Lab_GenderPieChart";
import UrgencyPieChart from "@/components/dashboard/lab/Lab_Urgency_Pi_Chart";
import CalendarComponent from "@/components/dashboard/lab/Lab_Calendar";

/** One shared height for left / mid / right columns. */
const COL_H = 520;
const MID_GAP = 12;
const MID_PANEL_H = (COL_H - MID_GAP) / 2;

function formatSelectedDate(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PanelProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
};

function ChartPanel({ title, subtitle, icon, children }: PanelProps) {
  return (
    <article
      className="surface-card flex w-full  flex-col overflow-hidden"
      style={{ height: "100%", boxSizing: "border-box" }}
    >
      <header
        className="flex shrink-0 items-center gap-2.5 border-b border-border px-3"
        style={{ height: 48 }}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
            {title}
          </h3>
          {subtitle ? (
            <p className="truncate text-[11px] leading-tight text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
      </header>
      <div
        className="p-2"
        style={{ height: "calc(100% - 48px)", overflow: "hidden" }}
      >
        {children}
      </div>
    </article>
  );
}

export default function DashboardCharts() {
  const today = "2026-07-15";
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (item) => item.order.orderedAt.slice(0, 10) === selectedDate,
    );
  }, [selectedDate]);

  const formattedDate = formatSelectedDate(selectedDate);

  return (
    <section className="space-y-4 px-4 pb-6 pt-2" aria-label="Lab analytics">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Analytics
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Workload &amp; mix overview
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground sm:self-auto">
          <CalendarDays size={14} className="text-primary" />
          <span>{filteredPatients.length} orders</span>
          <span className="text-muted-foreground">·</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div style={{ height: 300 }}>
          <ChartPanel
            title="Patient inflow"
            subtitle="Hourly order volume"
            icon={<Activity size={15} />}
          >
            <div style={{ height: "100%", width: "100%" }}>
              <LineChart patients={filteredPatients} />
            </div>
          </ChartPanel>
        </div>
        <div style={{ height: 240 }}>
          <ChartPanel
            title="Gender split"
            subtitle="Patient distribution"
            icon={<Users size={15} />}
          >
            <div style={{ height: "100%", width: "100%" }}>
              <GenderPieChart patients={filteredPatients} />
            </div>
          </ChartPanel>
        </div>
        <div style={{ height: 240 }}>
          <ChartPanel
            title="Priority mix"
            subtitle="Urgent · emergency · elective"
            icon={<PieChart size={15} />}
          >
            <div style={{ height: "100%", width: "100%" }}>
              <UrgencyPieChart patients={filteredPatients} />
            </div>
          </ChartPanel>
        </div>
        <div style={{ height: 340 }}>
          <ChartPanel
            title="Select date"
            subtitle="Filters all charts"
            icon={<CalendarDays size={15} />}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarComponent
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </ChartPanel>
        </div>
      </div>

      {/*
        Desktop: explicit pixel heights on every column.
        Do not put display:grid in inline style alongside Tailwind hidden —
        that overrides `hidden` and breaks equal-height layout.
      */}
      <div
        className="hidden lg:flex"
        style={{ height: COL_H, gap: 16, alignItems: "stretch" }}
      >
        {/* Left */}
        <div style={{ flex: 1, height: COL_H, overflow: "hidden" }}>
          <ChartPanel
            title="Patient inflow"
            subtitle="Hourly order volume"
            icon={<Activity size={15} />}
          >
            <div style={{ height: "100%", width: "100%" }}>
              <LineChart patients={filteredPatients} />
            </div>
          </ChartPanel>
        </div>

        {/* Mid — two panels with exact half heights */}
        <div
          style={{
            flex: 1,
            height: COL_H,
            display: "flex",
            flexDirection: "column",
            gap: MID_GAP,
            overflow: "hidden",
          }}
        >
          <div style={{ height: MID_PANEL_H, overflow: "hidden" }}>
            <ChartPanel
              title="Gender split"
              subtitle="Patient distribution"
              icon={<Users size={15} />}
            >
              <div style={{ height: "100%", width: "100%" }}>
                <GenderPieChart patients={filteredPatients} />
              </div>
            </ChartPanel>
          </div>
          <div style={{ height: MID_PANEL_H, overflow: "hidden" }}>
            <ChartPanel
              title="Priority mix"
              subtitle="Urgent · emergency · elective"
              icon={<PieChart size={15} />}
            >
              <div style={{ height: "100%", width: "100%" }}>
                <UrgencyPieChart patients={filteredPatients} />
              </div>
            </ChartPanel>
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: 1, height: COL_H, overflow: "hidden" }}>
          <ChartPanel
            title="Select date"
            subtitle="Filters all charts"
            icon={<CalendarDays size={15} />}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarComponent
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </ChartPanel>
        </div>
      </div>
    </section>
  );
}
