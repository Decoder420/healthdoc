"use client";

import {
  Package,
  AlertTriangle,
  Monitor,
  Users,
  ShoppingCart,
  CalendarClock,
} from "lucide-react";

const cards = [
  {
    title: "Total Items",
    value: "428",
    icon: Package,
  },
  {
    title: "Low Stock",
    value: "12",
    icon: AlertTriangle,
  },
  {
    title: "Machines",
    value: "9 / 10",
    icon: Monitor,
  },
  {
    title: "Technicians",
    value: "15",
    icon: Users,
  },
  {
    title: "Pending Orders",
    value: "3",
    icon: ShoppingCart,
  },
  {
    title: "Expiring Items",
    value: "8",
    icon: CalendarClock,
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="surface-card p-5 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-foreground">
                  {card.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Icon
                  size={22}
                  className="text-primary"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}