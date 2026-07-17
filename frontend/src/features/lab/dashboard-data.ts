import type { QuickAction } from "@/features/dashboard/types";
import { patients } from "@/lib/mock/lab_data";

export type LabQueueRow = {
  id: string;
  patientName: string;
  patientId: string;
  uhid: string;
  tests: string;
  priority: string;
  orderedAt: string;
  status: string;
};

function priorityRank(priority: string) {
  const p = priority.toLowerCase();
  if (p === "emergency") return 0;
  if (p === "urgent") return 1;
  return 2;
}

export function getLabDashboardMetrics(list = patients) {
  const inQueue = list.filter((p) => p.status === "QUEUE").length;
  const urgent = list.filter(
    (p) => p.order.priority.toLowerCase() === "urgent"
  ).length;
  const emergency = list.filter(
    (p) => p.order.priority.toLowerCase() === "emergency"
  ).length;
  const elective = list.filter(
    (p) => p.order.priority.toLowerCase() === "elective"
  ).length;
  const male = list.filter(
    (p) => p.patient.gender.toLowerCase() === "male"
  ).length;
  const female = list.filter(
    (p) => p.patient.gender.toLowerCase() === "female"
  ).length;

  return {
    totalOrders: list.length,
    inQueue,
    urgent,
    emergency,
    elective,
    male,
    female,
    samplesCollected: Math.max(list.length - 2, 0),
    inProcess: Math.min(5, list.length),
    rejected: 3,
    reportsReleased: 120,
    criticalAlerts: emergency + 2,
  };
}

export function getLabQueueRows(list = patients, limit = 8): LabQueueRow[] {
  return [...list]
    .sort(
      (a, b) =>
        priorityRank(a.order.priority) - priorityRank(b.order.priority)
    )
    .slice(0, limit)
    .map((item) => ({
      id: item.order.orderId,
      patientName: item.patient.name,
      patientId: item.patient.patientId,
      uhid: item.patient.uhid,
      tests: item.requestedTests.join(", "),
      priority: item.order.priority,
      orderedAt: item.order.orderedAt,
      status: item.status,
    }));
}

export const labQuickActions: QuickAction[] = [
  {
    label: "Test Queue",
    description: "Work pending pathology orders",
    href: "/lab/test_queue",
    color: "violet",
  },
  {
    label: "Print Barcode",
    description: "Generate sample barcodes",
    href: "/lab/pathology/barcode",
    color: "blue",
  },
  {
    label: "Sample Collection",
    description: "Track collected specimens",
    href: "/lab/pathology/sample",
    color: "teal",
  },
  {
    label: "Verification",
    description: "Review and release reports",
    href: "/lab/pathology/verification",
    color: "amber",
  },
];
