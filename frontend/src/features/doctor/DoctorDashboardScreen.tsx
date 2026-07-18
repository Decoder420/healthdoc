"use client";

import { DoctorDashboard } from "@/components/dashboard/doctor";
import { useAuth } from "@/providers/auth-provider";

export function DoctorDashboardScreen() {
  const { user } = useAuth();
  return <DoctorDashboard userName={user?.name.split(" ")[0]} />;
}
