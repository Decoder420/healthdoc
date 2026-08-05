"use client";

import Grid from "@mui/material/Grid2";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

import {
  appointmentQueue,
  getRadiologyQueueStats,
} from "@/components/dashboard/radiology/test_queue/DummyData";


export default function KPICards() {

  const stats = getRadiologyQueueStats(
    appointmentQueue
  );


  const scanned = appointmentQueue.filter(
    (item) =>
      [
        "Scan Started",
        "Completed",
        "Reporting",
        "Verified",
      ].includes(item.status)
  ).length;


  const kpiCards = [
    {
      id: 1,
      title: "In Queue",
      value: stats.inQueue,
      icon: (
        <GroupsRoundedIcon fontSize="large" />
      ),
    },

    {
      id: 2,
      title: "Scanned",
      value: scanned,
      icon: (
        <CameraAltRoundedIcon fontSize="large" />
      ),
    },

    {
      id: 3,
      title: "Reporting",
      value: stats.reporting,
      icon: (
        <EditNoteRoundedIcon fontSize="large" />
      ),
    },

    {
      id: 4,
      title: "Pending Verification",
      value: stats.reporting,
      icon: (
        <PendingActionsRoundedIcon fontSize="large" />
      ),
    },

    {
      id: 5,
      title: "Reports Released",
      value: stats.verified,
      icon: (
        <VerifiedRoundedIcon fontSize="large" />
      ),
    },

    {
      id: 6,
      title: "Critical Alerts",
      value: stats.emergency,
      icon: (
        <WarningAmberRoundedIcon fontSize="large" />
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