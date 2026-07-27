"use client";

import Grid from "@mui/material/Grid2";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";
import type { DashboardStatsProps } from "./types";

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid
          key={stat.title}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <DynamicCard
            title={stat.title}
            text={stat.text}
            icon={stat.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}