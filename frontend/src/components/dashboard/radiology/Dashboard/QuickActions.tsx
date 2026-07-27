"use client";

import { QuickActions as QuickActionsGrid } from "@/components/dashboard/receptionist/quick-actions";

import type { QuickAction } from "@/features/dashboard/types";

export const radiologyQuickActions: QuickAction[] = [
  {
    label: "Imaging Queue",
    description: "View pending imaging requests",
    href: "/radiology/queue",
    color: "violet",
  },
  {
    label: "Perform Scan",
    description: "Start CT, MRI, X-Ray or USG",
    href: "/radiology/scan",
    color: "blue",
  },
  {
    label: "Reporting",
    description: "Create radiology reports",
    href: "/radiology/reporting",
    color: "teal",
  },
  {
    label: "Verify Reports",
    description: "Review and release reports",
    href: "/radiology/verification",
    color: "amber",
  },
];


export default function RadiologyQuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        Quick Actions
      </h2>

      <QuickActionsGrid actions={radiologyQuickActions} />
    </div>
  );
}