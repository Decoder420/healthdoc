"use client";

import { QuickActions as QuickActionsGrid } from "@/components/dashboard/receptionist/quick-actions";

import type { QuickAction } from "@/features/dashboard/types";


export const radiologyQuickActions: QuickAction[] = [

  {
    label: "Imaging Queue",
    description:
      "View pending, processing and scheduled imaging studies",
    href: "/radiology/queue",
    color: "violet",
  },

  {
    label: "MRI Studies",
    description:
      "Manage MRI scans and reporting workflow",
    href: "/radiology/mri",
    color: "blue",
  },

  {
    label: "CT Studies",
    description:
      "Manage CT scan procedures and reports",
    href: "/radiology/ct",
    color: "teal",
  },

  {
    label: "X-Ray Studies",
    description:
      "View and process X-Ray imaging studies",
    href: "/radiology/xray",
    color: "blue",
  },

  {
    label: "USG Studies",
    description:
      "Manage ultrasound imaging workflow",
    href: "/radiology/usg",
    color: "teal",
  },

  {
    label: "Mammography",
    description:
      "Handle mammography scans and reports",
    href: "/radiology/mammography",
    color: "violet",
  },

  {
    label: "Enter Results",
    description:
      "Create radiology reports for completed studies",
    href: "/radiology/test_results",
    color: "blue",
  },

  {
    label: "Verify Reports",
    description:
      "Review, approve and verify radiology reports",
    href: "/radiology/verification",
    color: "amber",
  },

];


export default function RadiologyQuickActions() {

  return (
    <div>
      <QuickActionsGrid
        actions={radiologyQuickActions}
      />
    </div>
  );
}