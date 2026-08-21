"use client";

import { ChevronRight } from "lucide-react";
import { warningData } from "@/features/pharmacy/data/dashboardData";

interface WarningCardsProps {
  onAction: (title: string) => void;
}

export default function WarningCards({
  onAction,
}: WarningCardsProps) {
  return (
    <div className="space-y-4">
      {warningData.map((warning) => {
        const Icon = warning.icon;

        return (
          <div
            key={warning.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50"
          >
            <div className="flex items-start gap-4">
              <div
                className={`rounded-lg p-3 ${
                  warning.color === "red"
                    ? "bg-red-100 text-red-600"
                    : warning.color === "yellow"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                <Icon size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-[#001F54]">
                  {warning.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {warning.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAction(warning.title)}
              className="flex items-center gap-1 text-sm font-medium text-[#001F54] hover:underline"
            >
              View details
              <ChevronRight size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}