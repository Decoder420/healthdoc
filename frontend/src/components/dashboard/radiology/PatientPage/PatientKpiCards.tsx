"use client";

import Grid from "@mui/material/Grid2";

import {
  CalendarDays,
  ImageIcon,
  FileCheck2,
  Activity,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

import type {
  RadiologyQueueItem,
} from "@/components/dashboard/radiology/test_queue/DummyData";

interface Props {
  studies: RadiologyQueueItem[];
}

export default function RadiologyPatientKPICards({
  studies,
}: Props) {
  /*
   * ==========================================
   * TOTAL STUDIES
   * ==========================================
   */

  const totalStudies = studies.length;

  /*
   * ==========================================
   * TOTAL IMAGES
   * ==========================================
   */

  const totalImages = studies.reduce(
    (sum, study) =>
      sum + (study.imageCount ?? 0),
    0
  );

  /*
   * ==========================================
   * VERIFIED REPORTS
   * ==========================================
   */

  const totalReports = studies.filter(
    (study) =>
      study.reportStatus === "Verified"
  ).length;

  /*
   * ==========================================
   * CURRENT STATUS
   * ==========================================
   *
   * Assuming studies[0] is the latest study.
   */

  const currentStatus =
    studies[0]?.status ?? "Queue";

  /*
   * ==========================================
   * FORMAT STATUS
   * ==========================================
   */

  const getStatusLabel = (
    status: string
  ) => {
    switch (status) {
      case "Queue":
        return "In Queue";

      case "Processing":
        return "Processing";

      case "Verified":
        return "Verified";

      case "No Show":
        return "No Show";

      case "Removed":
        return "Removed";

      default:
        return status;
    }
  };

  /*
   * ==========================================
   * KPI DATA
   * ==========================================
   */

  const kpiData = [
    {
      title: "Total Studies",

      text: totalStudies.toString(),

      subtitle:
        totalStudies === 1
          ? "1 imaging study"
          : `${totalStudies} imaging studies`,

      icon: (
        <CalendarDays
          size={22}
          strokeWidth={2}
        />
      ),
    },

    {
      title: "Total Images",

      text: totalImages.toString(),

      subtitle:
        totalImages === 1
          ? "1 image available"
          : `${totalImages} images available`,

      icon: (
        <ImageIcon
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
        "Latest radiology status",

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
        mt: 4,
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
            subtitle={card.subtitle}
            icon={card.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}
