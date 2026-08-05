"use client";

import { QuickActions as QuickActionsGrid } from "@/components/dashboard/receptionist/quick-actions";

import type { QuickAction } from "@/features/dashboard/types";

export const radiologyQuickActions: QuickAction[] = [
  {
    label: "Imaging Queue",
    description: "View scheduled and pending imaging studies",
    href: "/radiology/queue",
    color: "violet",
  },

  {
    label: "Perform Scan",
    description: "Perform CT, MRI, X-Ray, USG and other studies",
    href: "/radiology/scan",
    color: "blue",
  },

  {
    label: "Reporting",
    description: "Prepare radiology reports for completed scans",
    href: "/radiology/reporting",
    color: "teal",
  },

  {
    label: "Verify Reports",
    description: "Review, approve and verify reports",
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