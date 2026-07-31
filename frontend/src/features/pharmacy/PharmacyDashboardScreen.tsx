"use client";

import { useState } from "react";
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
import InteractionDialog from "@/components/dashboard/pharmacist/dashboard/InteractionDialog";
import NearExpiryDialog from "@/components/dashboard/pharmacist/dashboard/NearExpiryyDialog";
import LowStockDialog from "@/components/dashboard/pharmacist/dashboard/LowStockDialog";

export function PharmacyDashboardScreen() {
  const [openInteraction, setOpenInteraction] = useState(false);
  const [openExpiry, setOpenExpiry] = useState(false);
  const [openLowStock, setOpenLowStock] = useState(false);


  return (
    <div className="space-y-6">
      <DashboardHeader />

      <DashboardStats {...dashboardStats} />

      <TodayQueue queue={todayQueue} />

        {/* Warning Center */}

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         <WarningCenter
           {...({
             onInteraction: () => setOpenInteraction(true),
             onExpiry: () => setOpenExpiry(true),
             onLowStock: () => setOpenLowStock(true),
           } as any)}
         />
           <ReturnMedicineRequest />
    </div>

    <InteractionDialog
  open={openInteraction}
  onClose={() => setOpenInteraction(false)}
/>

<NearExpiryDialog
  open={openExpiry}
  onClose={() => setOpenExpiry(false)}
/>

<LowStockDialog
  open={openLowStock}
  onClose={() => setOpenLowStock(false)}
/>

      {/* Recent Dispenses */}

      <RecentDispenses
    dispenses={recentDispenses}
/>

      {/* Quick Actions */}

      <QuickActions />
      


      {/* Activity Timeline */}
    </div>
  );
}