"use client";

import { MaintenanceLogPanel } from "@/features/maintenance/MaintenanceLogPanel";

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Equipment maintenance</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          The service record NABH expects per machine. Recorded by the people who
          operate the equipment — lab and radiology technicians as well as
          administrators.
        </p>
      </div>
      <MaintenanceLogPanel />
    </div>
  );
}
