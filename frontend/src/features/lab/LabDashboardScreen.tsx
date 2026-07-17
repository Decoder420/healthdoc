"use client";

import { LabTechnicianDashboard } from "@/components/dashboard/lab-technician";

/** Lab employee home dashboard screen. */
export default function LabDashboardScreen({
  userName = "Dr. Sharma",
}: {
  userName?: string;
}) {
  return <LabTechnicianDashboard userName={userName} />;
}
