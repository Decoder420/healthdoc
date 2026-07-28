"use client";

import Grid from "@mui/material/Grid2";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

const kpiCards = [
  {
    id: 1,
    title: "In Queue",
    value: 32,
    icon: <GroupsRoundedIcon fontSize="large" />,
    linkText: "View Queue",
    linkHref: "/radiology/queue",
  },
  {
    id: 2,
    title: "Scanned",
    value: 24,
    icon: <CameraAltRoundedIcon fontSize="large" />,
    linkText: "View Scans",
    linkHref: "/radiology/ct",
  },
  {
    id: 3,
    title: "Reporting",
    value: 11,
    icon: <EditNoteRoundedIcon fontSize="large" />,
    linkText: "Open Reporting",
    linkHref: "/radiology/mri",
  },
  {
    id: 4,
    title: "Pending Verification",
    value: 8,
    icon: <PendingActionsRoundedIcon fontSize="large" />,
    linkText: "Verify Reports",
    linkHref: "/radiology/queue",
  },
  {
    id: 5,
    title: "Reports Released",
    value: 145,
    icon: <VerifiedRoundedIcon fontSize="large" />,
    linkText: "Released Reports",
    linkHref: "/radiology/xray",
  },
  {
    id: 6,
    title: "Critical Alerts",
    value: 4,
    icon: <WarningAmberRoundedIcon fontSize="large" />,
    linkText: "View Alerts",
    linkHref: "/radiology/queue",
  },
];

export default function KPICards() {
  return (
    <Grid container spacing={3}>
      {kpiCards.map((card) => (
        <Grid
          key={card.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            xl: 2,
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