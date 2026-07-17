"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { patients } from "@/lib/mock/lab_data";
import {
  buildGenderCounts,
  buildHourlyPatientBuckets,
  buildPriorityCounts,
} from "@/lib/lab_chart_data";
import { ChartWrapper } from "@/components/ui";
import LabCalendar from "@/components/ui/Lab_Calendar";
import { meridian } from "@/styles/theme";

export default function DashboardCharts() {
  const today = "2026-07-15";
  const [selectedDate, setSelectedDate] = useState(today);

  const filteredPatients = useMemo(
    () => patients.filter((item) => item.order.orderedAt.slice(0, 10) === selectedDate),
    [selectedDate],
  );

  const hourly = useMemo(
    () => buildHourlyPatientBuckets(filteredPatients),
    [filteredPatients],
  );
  const gender = useMemo(() => buildGenderCounts(filteredPatients), [filteredPatients]);
  const priority = useMemo(() => buildPriorityCounts(filteredPatients), [filteredPatients]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr 1fr" },
        gap: 2,
        px: 2,
        py: 1.5,
      }}
    >
      <ChartWrapper
        title="Patients by hour"
        description={`Orders for ${selectedDate}`}
        height={420}
        empty={hourly.every((d) => d.count === 0)}
      >
        <LineChart data={hourly} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="4 6" vertical={false} stroke={meridian.border} />
          <XAxis
            dataKey="slot"
            tickLine={false}
            axisLine={false}
            interval={3}
            tick={{ fontSize: 10, fill: meridian.textSecondary }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fontSize: 11, fill: meridian.textSecondary }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke={meridian.brandPrimary}
            strokeWidth={2.5}
            dot={{ r: 3, fill: meridian.brandPrimary }}
          />
        </LineChart>
      </ChartWrapper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <ChartWrapper title="Gender mix" height={190} empty={gender.length === 0}>
          <PieChart>
            <Pie data={gender} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
              {gender.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartWrapper>

        <ChartWrapper title="Priority mix" height={190} empty={priority.length === 0}>
          <PieChart>
            <Pie data={priority} dataKey="value" nameKey="name" outerRadius={72} paddingAngle={3}>
              {priority.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartWrapper>
      </Box>

      <Box
        sx={{
          borderRadius: "16px",
          border: `1px solid ${meridian.border}`,
          background: `linear-gradient(180deg, ${meridian.surface} 0%, #fbfcfe 100%)`,
          boxShadow:
            "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
          overflow: "hidden",
          p: 2,
        }}
      >
        <Box sx={{ px: 1, pb: 1 }}>
          <Box
            component="h3"
            sx={{
              m: 0,
              fontSize: "1.0625rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: meridian.textPrimary,
            }}
          >
            Filter by date
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              mt: 0.5,
              fontSize: "0.8125rem",
              color: meridian.textSecondary,
            }}
          >
            Select a day to refresh charts
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <LabCalendar value={selectedDate} onChange={setSelectedDate} />
        </Box>
      </Box>
    </Box>
  );
}
