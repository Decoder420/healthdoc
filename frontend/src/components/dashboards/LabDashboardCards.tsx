"use client";

import Box from "@mui/material/Box";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useRouter } from "next/navigation";

import { MetricCard } from "@/components/ui";

const cards = [
  {
    label: "Samples Collected",
    value: "248",
    icon: <ScienceRoundedIcon />,
  },
  {
    label: "Pending Samples",
    value: "18",
    icon: <PendingActionsRoundedIcon />,
  },
  {
    label: "In Process",
    value: "5",
    icon: <BiotechRoundedIcon />,
  },
  {
    label: "Rejected Samples",
    value: "3",
    icon: <CancelRoundedIcon />,
  },
  {
    label: "Reports Released",
    value: "120",
    icon: <DescriptionRoundedIcon />,
  },
  {
    label: "Critical Alerts",
    value: "5",
    icon: <WarningAmberRoundedIcon />,
    href: "/pathology/critical_alerts",
  },
];

export default function DashboardCards() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
          xl: "repeat(6, minmax(0, 1fr))",
        },
        gap: 2,
        px: 2,
      }}
    >
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          size="sm"
          onClick={card.href ? () => router.push(card.href!) : undefined}
        />
      ))}
    </Box>
  );
}
