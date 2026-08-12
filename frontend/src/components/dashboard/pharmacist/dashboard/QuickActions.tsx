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
    description: "Review and dispense medicines",
    icon: Pill,
    route: "/pharmacy/prescription-queue",
  },
  {
    title: "Create Indent",
    description: "Request medicines from inventory",
    icon: ClipboardPlus,
    route: "/inventory/indent",
  },
  {
    title: "Stock Adjustment",
    description: "Update and correct stock",
    icon: SlidersHorizontal,
    route: "/inventory/audit/stock-ledger",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#001F54] mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => router.push(action.route)}
              className="
                flex items-center gap-4
                border rounded-xl p-4
                hover:shadow-md
                transition
                text-left
              "
            >
              <div
                className="
                  bg-[#001F54]
                  text-white
                  p-3
                  rounded-lg
                "
              >
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