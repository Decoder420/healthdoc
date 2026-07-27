"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  PieChart,
} from "lucide-react";

import { patients } from "@/lib/mock/lab_data";

import LineChart from "@/components/dashboard/lab/Lab_LineCharts";
import UrgencyPieChart from "@/components/dashboard/lab/Lab_Urgency_Pi_Chart";
import CalendarComponent from "@/components/dashboard/lab/Lab_Calendar";

const COL_H = 520;

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

function ChartPanel({
  title,
  subtitle,
  icon,
  children,
}: PanelProps) {
  return (
    <article
      className="surface-card flex w-full flex-col overflow-hidden"
      style={{
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <header
        className="flex shrink-0 items-center gap-2.5 border-b border-border px-3"
        style={{ height: 48 }}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h3>

          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </header>

      <div
        className="p-2"
        style={{
          height: "calc(100% - 48px)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </article>
  );
}

export default function DashboardCharts() {
  const today = "2026-07-15";

  const [selectedDate, setSelectedDate] =
    useState(today);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (item) =>
        item.order.orderedAt.slice(0, 10) ===
        selectedDate
    );
  }, [selectedDate]);

  const formattedDate =
    formatSelectedDate(selectedDate);

  return (
    <section className="space-y-4 px-4 pb-6 pt-2">

      {/* Header */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Analytics
          </p>

          <h2 className="mt-1 text-lg font-semibold text-foreground">
            Workload & Mix Overview
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium">

          <CalendarDays
            size={14}
            className="text-primary"
          />

          <span>
            {filteredPatients.length} Orders
          </span>

          <span className="text-muted-foreground">
            •
          </span>

          <span>{formattedDate}</span>

        </div>
      </div>

      {/* Mobile */}

      <div className="flex flex-col gap-4 lg:hidden">

        <div style={{ height: 300 }}>
          <ChartPanel
            title="Patient Inflow"
            subtitle="Hourly order volume"
            icon={<Activity size={15} />}
          >
            <LineChart
              patients={filteredPatients}
            />
          </ChartPanel>
        </div>

        <div style={{ height: 240 }}>
          <ChartPanel
            title="Priority Mix"
            subtitle="Urgent • Emergency • Elective"
            icon={<PieChart size={15} />}
          >
            <UrgencyPieChart
              patients={filteredPatients}
            />
          </ChartPanel>
        </div>

        <div style={{ height: 340 }}>
          <ChartPanel
            title="Select Date"
            subtitle="Filters all charts"
            icon={<CalendarDays size={15} />}
          >
            <div
              className="flex h-full items-center justify-center"
            >
              <CalendarComponent
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </ChartPanel>
        </div>

      </div>

      {/* Desktop */}

      <div
        className="hidden lg:flex"
        style={{
          height: COL_H,
          gap: 16,
        }}
      >

        {/* 40% */}

        <div
          style={{
            flex: 4,
            height: COL_H,
          }}
        >
          <ChartPanel
            title="Patient Inflow"
            subtitle="Hourly order volume"
            icon={<Activity size={15} />}
          >
            <LineChart
              patients={filteredPatients}
            />
          </ChartPanel>
        </div>

        {/* 30% */}

        <div
          style={{
            flex: 3,
            height: COL_H,
          }}
        >
          <ChartPanel
            title="Priority Mix"
            subtitle="Urgent • Emergency • Elective"
            icon={<PieChart size={15} />}
          >
            <UrgencyPieChart
              patients={filteredPatients}
            />
          </ChartPanel>
        </div>

        {/* 30% */}

        <div
          style={{
            flex: 3,
            height: COL_H,
          }}
        >
          <ChartPanel
            title="Select Date"
            subtitle="Filter dashboard"
            icon={<CalendarDays size={15} />}
          >
            <div className="flex h-full items-center justify-center">
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