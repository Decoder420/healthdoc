"use client";

import Grid from "@mui/material/Grid2";

import {
  FileCheck2,
  CalendarCheck2,
  Users,
  ShieldAlert,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";
import { reports } from "./DummyData";

const iconSize = 30;

export default function VerificationKPICards() {
  const today = new Date().toISOString().split("T")[0];

  const totalReports = reports.length;

  const todayReports = reports.filter((item) =>
    item.report.verifiedDate.startsWith(today)
  ).length;

  const totalPatients = new Set(
    reports.map((item) => item.patient.patientId)
  ).size;

  const criticalReports = reports.filter((item) =>
    item.results.some(
      (result) =>
        result.flag === "HIGH" ||
        result.flag === "CRITICAL"
    )
  ).length;

  const kpiData = [
    {
      title: "Verified Reports",
      text: totalReports.toString(),
      icon: <FileCheck2 size={iconSize} strokeWidth={2} />,
    },
    {
      title: "Verified Today",
      text: todayReports.toString(),
      icon: <CalendarCheck2 size={iconSize} strokeWidth={2} />,
    },
    {
      title: "Patients",
      text: totalPatients.toString(),
      icon: <Users size={iconSize} strokeWidth={2} />,
    },
    {
      title: "Critical Reports",
      text: criticalReports.toString(),
      icon: <ShieldAlert size={iconSize} strokeWidth={2} />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {kpiData.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, lg: 3 }}
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