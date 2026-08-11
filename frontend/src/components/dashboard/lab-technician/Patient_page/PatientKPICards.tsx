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
    (sum, visit) =>
      sum + (visit.requestedTests?.length ?? 0),
    0
  );

  const totalReports = visits.filter(
    (visit) =>
      visit.status === "VERIFIED"
  ).length;

  const currentStatus =
    visits[0]?.status ?? "QUEUE";

  const getStatusLabel = (
    status: string
  ) => {
    switch (status) {
      case "VERIFIED":
        return "Verified";

      case "PROCESSING":
        return "Processing";

      case "READY":
        return "Ready";

      case "COLLECTED":
        return "Collected";

      case "QUEUE":
        return "In Queue";

      case "RECOLLECTION_REQUIRED":
        return "Recollection";

      default:
        return status
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char: string) =>
            char.toUpperCase()
          );
    }
  };

  const kpiData = [
    {
      title: "Total Visits",
      text: totalVisits.toString(),
      subtitle:
        totalVisits === 1
          ? "1 laboratory visit"
          : `${totalVisits} laboratory visits`,
      icon: (
        <CalendarDays
          size={22}
          strokeWidth={2}
        />
      ),
    },

    {
      title: "Lab Tests",
      text: totalTests.toString(),
      subtitle:
        totalTests === 1
          ? "1 test ordered"
          : `${totalTests} tests ordered`,
      icon: (
        <FlaskConical
          size={22}
          strokeWidth={2}
        />
      ),
    },

    {
      title: "Verified Reports",
      text: totalReports.toString(),
      subtitle:
        totalReports === 1
          ? "1 report verified"
          : `${totalReports} reports verified`,
      icon: (
        <FileCheck2
          size={22}
          strokeWidth={2}
        />
      ),
    },

    {
      title: "Current Status",
      text: getStatusLabel(
        currentStatus
      ),
      subtitle:
        "Latest laboratory status",
      icon: (
        <Activity
          size={22}
          strokeWidth={2}
        />
      ),
    },
  ];

  return (
    <Grid
      container
      spacing={{
        xs: 2,
        md: 2.5,
      }}
      sx={{
        mt:4,
        mb: 4,
      }}
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
            subtitle={card.subtitle}
          />
        </Grid>
      ))}
    </Grid>
  );
}
