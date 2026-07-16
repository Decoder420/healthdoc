import Link from "next/link";
import type { QueueItem } from "@/features/dashboard/types";
import { cn } from "@/lib/utils/cn";

export function WaitingQueue({ queue }: { queue: QueueItem[] }) {
  return (
    <div className="surface-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">OPD Waiting Queue</h2>
          <p className="text-xs text-muted-foreground">{queue.length} patients waiting</p>
        </div>
        <Link href="/receptionist/queue" className="link-primary text-xs">
          Manage queue
        </Link>
      </div>
      <ul className="divide-y divide-border">
        {queue.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-muted-foreground">
            No patients in queue. Complete an OPD check-in to add patients.
          </li>
        ) : (
          queue.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {item.token}
              </span>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">
                  {item.patientName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.patientId} · {item.doctorName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{item.waitTime}</p>
              <span
                className={cn(
                  "text-xs font-medium",
                  item.priority === "urgent" ? "text-danger" : "text-muted-foreground",
                )}
              >
                {item.priority === "urgent" ? "Urgent" : "Normal"}
              </span>
            </div>
          </li>
          ))
        )}
      </ul>
    </div>
  );
}
