"use client";

import { getIpdOpsStats } from "@/features/ipd/api";

type IpdStatsProps = {
  refreshKey?: number;
};

export function IpdStats({ refreshKey = 0 }: IpdStatsProps) {
  const statsData = getIpdOpsStats();
  void refreshKey;

  const stats = [
    {
      label: "Pending Requests",
      value: statsData.pendingRequests,
      hint: "Awaiting bed & nurse",
    },
    {
      label: "Active Admissions",
      value: statsData.activeCare,
      hint: "Assigned or in care",
    },
    {
      label: "Beds Available",
      value: statsData.availableBeds,
      hint: `${statsData.occupiedBeds} occupied`,
    },
    {
      label: "Nurses Available",
      value: statsData.availableNurses,
      hint: "Ready for assignment",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="surface-card p-5">
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}
