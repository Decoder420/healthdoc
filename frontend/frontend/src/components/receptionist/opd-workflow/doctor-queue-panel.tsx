"use client";

import { useOpdQueue } from "@/features/opd/context/opd-queue-context";

export function DoctorQueuePanel() {
  const { queue, waitingCount } = useOpdQueue();

  return (
    <div className="surface-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Doctor Queue</h2>
        <p className="text-xs text-muted-foreground">{waitingCount} patients waiting</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Token</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">UHID</th>
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queue.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No patients in queue yet.
                </td>
              </tr>
            ) : (
              queue.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3.5 font-semibold text-primary">
                    {entry.tokenNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-sans font-medium text-foreground">{entry.patientName}</p>
                    <p className="text-xs text-muted-foreground">{entry.opdId}</p>
                  </td>
                  <td className="px-5 py-3.5 text-foreground">{entry.uhid}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-foreground">{entry.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{entry.department}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex rounded-full bg-info-muted px-2.5 py-0.5 text-xs font-medium capitalize text-info">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
