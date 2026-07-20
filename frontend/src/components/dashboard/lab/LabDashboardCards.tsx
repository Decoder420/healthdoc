"use client";

import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";
import { patients } from "@/lib/mock/lab_data";

export default function DashboardCards() {
  const cards = [
    {
      title: "Samples Collected",
      text: patients.filter((p) => p.status === "COLLECTED").length.toString(),
      icon: <ScienceRoundedIcon fontSize="large" />,
    },
    {
      title: "Pending Samples",
      text: patients.filter((p) => p.status === "QUEUE").length.toString(),
      icon: <PendingActionsRoundedIcon fontSize="large" />,
    },
    {
      title: "In Process",
      text: patients.filter((p) => p.status === "PROCESSING").length.toString(),
      icon: <BiotechRoundedIcon fontSize="large" />,
    },
    {
      title: "Rejected Samples",
      text: patients
        .filter((p) => p.status === "REJECTED")
        .length.toString(),
      icon: <CancelRoundedIcon fontSize="large" />,
    },
    {
      title: "Reports Released",
      text: patients.filter((p) => p.status === "VERIFIED").length.toString(),
      icon: <DescriptionRoundedIcon fontSize="large" />,
    },
    {
      title: "Critical Alerts",
      text: patients
        .filter((p) => p.order.priority === "Emergency")
        .length.toString(),
      icon: <WarningAmberRoundedIcon fontSize="large" />,
      linkText: "View →",
      linkHref: "/pathology/critical_alerts",
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 lg:overflow-visible px-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex-shrink-0 w-[240px] lg:w-full lg:flex-shrink"
        >
          <DynamicCard {...card} />
        </div>
      ))}
    </div>
  );
}