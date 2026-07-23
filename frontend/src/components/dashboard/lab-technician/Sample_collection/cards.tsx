"use client";

import Grid from "@mui/material/Grid2";

import {
  FlaskConical ,
  BadgeCheck,
  Clock3,
  TriangleAlert,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

const iconSize = 30;

const kpiData = [
  {
    title: "Total Samples",
    text: "186",
    icon: (
      <FlaskConical 
        size={iconSize}
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Collected Today",
    text: "42",
    icon: (
      <BadgeCheck
        size={iconSize}
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Pending Collection",
    text: "18",
    icon: (
      <Clock3
        size={iconSize}
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Urgent Samples",
    text: "06",
    icon: (
      <TriangleAlert
        size={iconSize}
        strokeWidth={2.2}
      />
    ),
  },
];

export default function SampleKPICards() {
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