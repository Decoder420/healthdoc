"use client";

import DashboardHeader from "@/components/dashboard/pharmacist/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/pharmacist/dashboard/DashboardStats";
import TodayQueue from "@/components/dashboard/pharmacist/dashboard/TodayQueue";
import RecentDispenses from "@/components/dashboard/pharmacist/dashboard/RecentDispenses";
import QuickActions from "@/components/dashboard/pharmacist/dashboard/QuickActions";
import WarningCenter from "@/components/dashboard/pharmacist/dashboard/WarningCenter";
import ReturnMedicineRequest from "@/components/dashboard/pharmacist/dashboard/ReturnMedicineRequest";

import {
  dashboardStats,
  todayQueue,
  recentDispenses,
} from "@/features/pharmacy/data/dashboardData";

export function PharmacyDashboardScreen() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      <DashboardStats {...dashboardStats} />

      <TodayQueue queue={todayQueue} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <WarningCenter />
        <ReturnMedicineRequest />
      </div>

      <RecentDispenses dispenses={recentDispenses} />

      <QuickActions />
    </div>
  );
}