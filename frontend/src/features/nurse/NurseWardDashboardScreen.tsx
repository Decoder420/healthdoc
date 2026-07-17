"use client";

import { NurseDashboard } from "@/components/dashboard/nurse";
import { useAuth } from "@/providers/auth-provider";

export function NurseWardDashboardScreen() {
  const { user } = useAuth();
  return <NurseDashboard userName={user?.name.split(" ")[0]} />;
}
