"use client";

import {
  History,
  FileText,
  Printer,
  RotateCcw,
} from "lucide-react";

export default function HistoryStats() {
  const stats = [
    {
      title: "Total Dispenses",
      value: "248",
      icon: History,
    },
    {
      title: "Receipts Generated",
      value: "248",
      icon: FileText,
    },
    {
      title: "Printed Today",
      value: "32",
      icon: Printer,
    },
    {
      title: "Reprints",
      value: "6",
      icon: RotateCcw,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="surface-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#001F54]">
                  {stat.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Icon
                  size={24}
                  className="text-[#001F54]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}