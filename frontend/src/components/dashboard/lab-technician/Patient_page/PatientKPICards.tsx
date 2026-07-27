"use client";

import Grid from "@mui/material/Grid2";

import {
  CalendarDays,
  FlaskConical,
  FileCheck2,
  Activity,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

interface Props {
  visits: any[];
}

export default function PatientKPICards({
  visits,
}: Props) {
  const totalVisits = visits.length;

  const totalTests = visits.reduce(
    (sum, visit) => sum + visit.requestedTests.length,
    0
  );

  const totalReports = visits.filter(
    (visit) => visit.status === "VERIFIED"
  ).length;

  const currentStatus = visits[0]?.status ?? "QUEUE";

  const kpiData = [
    {
      title: "Total Visits",
      text: totalVisits.toString(),
      icon: <CalendarDays size={22} strokeWidth={2} />,
    },
    {
      title: "Lab Tests",
      text: totalTests.toString(),
      icon: <FlaskConical size={22} strokeWidth={2} />,
    },
    {
      title: "Reports",
      text: totalReports.toString(),
      icon: <FileCheck2 size={22} strokeWidth={2} />,
    },
    {
      title: "Current Status",
      text: currentStatus,
      icon: <Activity size={22} strokeWidth={2} />,
    },
  ];

  return (
    <Grid
      container
      spacing={3}
      sx={{ mb: 4 }}
    >
      {kpiData.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DynamicCard
            title={card.title}
            text={card.text}
            icon={card.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}