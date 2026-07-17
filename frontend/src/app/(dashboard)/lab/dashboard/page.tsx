"use client";

import { LabDashboardScreen } from "@/features/lab";
import { useAuth } from "@/providers/auth-provider";

export default function LabDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Technician";

  return <LabDashboardScreen userName={firstName} />;
}
