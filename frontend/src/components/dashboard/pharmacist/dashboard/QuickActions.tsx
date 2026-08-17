"use client";

import { useRouter } from "next/navigation";
import {
  Pill,
  ClipboardPlus,
  SlidersHorizontal,
} from "lucide-react";

const actions = [
  {
    title: "Dispense",
    description: "Dispense medicines from prescriptions",
    icon: Pill,
    route: "/pharmacy/prescription-queue",
  },
  {
    title: "Create Indent",
    description: "Request medicines from inventory",
    icon: ClipboardPlus,
    route: "/inventory/departments/IndentRequests",
  },
  {
    title: "Stock Adjustment",
    description: "Update stock corrections",
    icon: SlidersHorizontal,
    route: "/pharmacy/QuickActions/PharmacyStockAdjustment",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section className="surface-card p-5">
      <h2 className="mb-4 text-lg font-semibold text-[#001F54]">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => router.push(action.route)}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:shadow-md"
            >
              <div className="rounded-lg bg-[#001F54] p-3 text-white">
                <Icon size={22} />
              </div>

              <div>
                <h3 className="font-medium text-[#001F54]">
                  {action.title}
                </h3>

                <p className="text-xs text-gray-500">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}