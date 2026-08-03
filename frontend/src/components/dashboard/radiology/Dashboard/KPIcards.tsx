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
  const stats = getRadiologyQueueStats();
  const scanned = appointmentQueue.filter((item) =>
    ["Completed", "Verified", "Reporting", "Scan Started"].includes(
      item.status,
    ),
  ).length;
  const pendingVerification = appointmentQueue.filter(
    (item) => item.status === "Reporting",
  ).length;
  const released = appointmentQueue.filter(
    (item) => item.status === "Verified",
  ).length;

  const kpiCards = [
    {
      id: 1,
      title: "In Queue",
      value: stats.inQueue,
      icon: <GroupsRoundedIcon fontSize="large" />,
      linkText: "View Queue",
      linkHref: "/radiology/queue",
    },
    {
      id: 2,
      title: "Scanned",
      value: scanned,
      icon: <CameraAltRoundedIcon fontSize="large" />,
      linkText: "View Scans",
      linkHref: "/radiology/ct",
    },
    {
      id: 3,
      title: "Reporting",
      value: stats.reporting,
      icon: <EditNoteRoundedIcon fontSize="large" />,
      linkText: "Open Reporting",
      linkHref: "/radiology/mri",
    },
    {
      id: 4,
      title: "Pending Verification",
      value: pendingVerification,
      icon: <PendingActionsRoundedIcon fontSize="large" />,
      linkText: "Verify Reports",
      linkHref: "/radiology/queue",
    },
    {
      id: 5,
      title: "Reports Released",
      value: released,
      icon: <VerifiedRoundedIcon fontSize="large" />,
      linkText: "Released Reports",
      linkHref: "/radiology/xray",
    },
    {
      id: 6,
      title: "Critical Alerts",
      value: stats.emergency,
      icon: <WarningAmberRoundedIcon fontSize="large" />,
      linkText: "View Alerts",
      linkHref: "/radiology/queue",
    },
  ];

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
