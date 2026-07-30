"use client";

import {
  FileText,
  Clock3,
  Pill,
  PauseCircle,
  MessageCircleWarning,
} from "lucide-react";

import StatCard from "./StatCard";

interface DashboardStatsProps {
  todayPrescriptions: number;
  waitingQueue: number;
  dispensedToday: number;
  onHold: number;
  clarificationPending: number;
}

export default function DashboardStats({
  todayPrescriptions,
  waitingQueue,
  dispensedToday,
  onHold,
  clarificationPending,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Today's Prescriptions"
        value={todayPrescriptions}
        icon={FileText}
      />

      <StatCard
        title="Waiting Queue"
        value={waitingQueue}
        icon={Clock3}
      />

      <StatCard
        title="Dispensed Today"
        value={dispensedToday}
        icon={Pill}
      />

      <StatCard
        title="On Hold"
        value={onHold}
        icon={PauseCircle}
      />

      <StatCard
        title="Clarification Pending"
        value={clarificationPending}
        icon={MessageCircleWarning}
      />
    </div>
  );
}