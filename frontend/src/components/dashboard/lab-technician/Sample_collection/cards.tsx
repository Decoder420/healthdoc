"use client";

import Grid from "@mui/material/Grid2";

import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

const kpiData = [
  {
    title: "Total Samples",
    text: "186",
    icon: <ScienceRoundedIcon fontSize="inherit" />,
  },
  {
    title: "Collected Today",
    text: "42",
    icon: <CheckCircleRoundedIcon fontSize="inherit" />,
  },
  {
    title: "Pending Collection",
    text: "18",
    icon: <PendingActionsRoundedIcon fontSize="inherit" />,
  },
  {
    title: "Urgent Samples",
    text: "06",
    icon: <PriorityHighRoundedIcon fontSize="inherit" />,
  },
];

export default function SampleKPICards() {
  return (
    <Grid container spacing={3}>
      {kpiData.map((card) => (
        <Grid
          size={{ xs: 12, sm: 6, lg: 3 }}
          key={card.title}
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