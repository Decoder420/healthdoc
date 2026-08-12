"use client";

import Grid from "@mui/material/Grid2";

import {
  ClipboardList,
  Clock3,
  ScanLine,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

import {
  appointmentQueue,
  getRadiologyQueueStats,
} from "@/components/dashboard/radiology/test_queue/DummyData";

const iconSize = 30;

export default function KPICards() {
  const stats = getRadiologyQueueStats(appointmentQueue);

  const kpiCards = [
    {
      id: 1,
      title: "Total Studies",
      value: stats.total,
      icon: (
        <ClipboardList
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },
    {
      id: 2,
      title: "In Queue",
      value: stats.inQueue,
      icon: (
        <Clock3
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },
    {
      id: 3,
      title: "Processing",
      value: stats.inProgress,
      icon: (
        <ScanLine
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },
    {
      id: 4,
      title: "Reports Released",
      value: stats.verified,
      icon: (
        <BadgeCheck
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },
    {
      id: 5,
      title: "Emergency",
      value: stats.emergency,
      icon: (
        <ShieldAlert
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },
  ];

  return (
    <Grid
      container
      spacing={3}
    >
      {kpiCards.map((card) => (
        <Grid
          key={card.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2.4,
          }}
        >
          <DynamicCard
            title={card.title}
            text={String(card.value)}
            icon={card.icon}
          />
        </Grid>
      ))}
    </Grid>
  );
}
