"use client";

import { useMemo } from "react";
import {
  receptionistQuickActions,
  receptionistStats,
  recentRegistrations,
} from "@/features/dashboard/data/mock-data";
import type { AppointmentItem } from "@/features/dashboard/types";
import { getTodaysAppointments } from "@/features/appointments/api";
import { formatAppointmentTime } from "@/features/appointments/data/mock-appointments";
import { useOpdQueue } from "@/features/opd/context/opd-queue-context";
import {
  getWaitingQueueEntries,
  queueEntryToDashboardItem,
} from "@/features/opd/utils/queue-display";
import { QuickActions } from "./quick-actions";
import { RecentRegistrations } from "./recent-registrations";
import { StatCard } from "./stat-card";
import { TodaysAppointments } from "./todays-appointments";
import { WaitingQueue } from "./waiting-queue";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toDashboardAppointmentItem(
  appointment: ReturnType<typeof getTodaysAppointments>[number],
): AppointmentItem {
  const status =
    appointment.status === "no-show" ? "cancelled" : appointment.status;
  const type =
    appointment.type === "consultation" ? "new" : appointment.type;

  return {
    id: appointment.id,
    time: formatAppointmentTime(appointment.time),
    patientName: appointment.patientName,
    patientId: appointment.patientUhid,
    doctorName: appointment.doctorName,
    department: appointment.department,
    status,
    type,
  };
}

type ReceptionistDashboardProps = {
  userName?: string;
};

export function ReceptionistDashboard({
  userName = "Receptionist",
}: ReceptionistDashboardProps) {
  const { queue, waitingCount } = useOpdQueue();

  const liveWaitingQueue = useMemo(
    () =>
      getWaitingQueueEntries(queue).map(queueEntryToDashboardItem),
    [queue],
  );

  const todaysAppointments = useMemo(
    () => getTodaysAppointments().map(toDashboardAppointmentItem),
    [],
  );

  const liveStats = useMemo(() => {
    const scheduled = todaysAppointments.filter(
      (item) => item.status === "scheduled",
    ).length;
    const urgentWaiting = getWaitingQueueEntries(queue).filter(
      (entry) => entry.priority === "urgent",
    ).length;

    return receptionistStats.map((stat) => {
      if (stat.label === "Today's Appointments") {
        return {
          ...stat,
          value: todaysAppointments.length,
          change: `${scheduled} still scheduled`,
        };
      }
      if (stat.label === "Waiting in Queue") {
        return {
          ...stat,
          value: waitingCount,
          change:
            urgentWaiting > 0
              ? `${urgentWaiting} urgent`
              : "Updated live from OPD",
        };
      }
      return stat;
    });
  }, [todaysAppointments, queue, waitingCount]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Reception Desk</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {getGreeting()}, {userName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate()}</p>
        </div>
        <div className="surface-muted flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          OPD counter open · Shift 08:00 – 16:00
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h2>
        <QuickActions actions={receptionistQuickActions} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TodaysAppointments appointments={todaysAppointments} />
        </div>
        <RecentRegistrations registrations={recentRegistrations} />
      </div>

      <WaitingQueue queue={liveWaitingQueue} />
    </div>
  );
}
