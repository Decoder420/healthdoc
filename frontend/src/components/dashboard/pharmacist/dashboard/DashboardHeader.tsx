"use client";

import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="surface-card p-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Pharmacy" },
        ]}
      />

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Pharmacy Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor today's pharmacy workflow, prescriptions and inventory
            notifications.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search Prescription / UHID..."
              className="w-72 rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="surface-muted flex items-center rounded-lg px-4 py-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Current Shift
              </p>

              <p className="font-medium">
                Morning (08:00 AM - 04:00 PM)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}