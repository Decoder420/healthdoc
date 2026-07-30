"use client";

import { dashboardByRole } from "@/components/dashboard";
import { ModulePage } from "@/components/shared/module-page";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  const Dashboard = user?.role ? dashboardByRole[user.role] : undefined;

  if (Dashboard) {
    return <Dashboard userName={user?.name.split(" ")[0]} />;
  }

  return (
    <ModulePage
      title="Dashboard"
      description="Overview of hospital operations and key metrics."
    />
  );
}
