"use client";

import { Badge } from "@/components/ui";

type RadiologyDashboardHeaderProps = {
  userName?: string;
  departmentStatus?: string;
  shift?: string;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";

  return "Good Evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function RadiologyDashboardHeader({
  userName = "Dr. Sharma",
  departmentStatus = "Department Open",
  shift = "08:00 – 20:00",
}: RadiologyDashboardHeaderProps) {
  const isOpen =
    departmentStatus.toLowerCase().includes("open");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

      {/* Left */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge>
            Radiology
          </Badge>

          <Badge variant="muted">
            RIS Dashboard
          </Badge>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {getGreeting()}, {userName}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Today's radiology overview
          {" • "}
          {formatDate()}
        </p>
      </div>


      {/* Right */}
      <div className="surface-muted flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-muted-foreground">

        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              isOpen
                ? "bg-success"
                : "bg-error"
            }`}
          />

          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              isOpen
                ? "bg-success"
                : "bg-error"
            }`}
          />
        </span>

        <div>
          <p className="font-medium text-foreground">
            {departmentStatus}
          </p>

          <p>
            Shift {shift}
          </p>
        </div>

      </div>

    </div>
  );
}