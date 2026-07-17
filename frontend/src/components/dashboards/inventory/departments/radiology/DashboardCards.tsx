"use client";

import Box from "@mui/material/Box";
import PackageIcon from "@mui/icons-material/Inventory2Outlined";
import AlertIcon from "@mui/icons-material/WarningAmberOutlined";
import MonitorIcon from "@mui/icons-material/MonitorOutlined";
import UsersIcon from "@mui/icons-material/GroupsOutlined";
import CartIcon from "@mui/icons-material/ShoppingCartOutlined";
import CalendarIcon from "@mui/icons-material/EventOutlined";

import { MetricCard } from "@/components/ui";

const cards = [
  { label: "Total Items", value: "428", icon: <PackageIcon /> },
  { label: "Low Stock", value: "12", icon: <AlertIcon /> },
  { label: "Machines", value: "9 / 10", icon: <MonitorIcon /> },
  { label: "Technicians", value: "15", icon: <UsersIcon /> },
  { label: "Pending Orders", value: "3", icon: <CartIcon /> },
  { label: "Expiring Items", value: "8", icon: <CalendarIcon /> },
];

export default function DashboardCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(3, 1fr)",
          xl: "repeat(6, 1fr)",
        },
        gap: 2,
      }}
    >
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          size="sm"
        />
      ))}
    </Box>
  );
}
