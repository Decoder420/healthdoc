"use client";

import { useOpdQueue } from "@/features/opd/context/opd-queue-context";

export function QueueDisplayScreen() {
  const { queue } = useOpdQueue();

  return (
    <div className="min-h-screen bg-primary p-8 text-primary-foreground">
      <h1 className="text-center text-4xl font-bold">OPD Queue</h1>
      <p className="mt-2 text-center text-lg opacity-80">
        Now serving — public display
      </p>
      <div className="mx-auto mt-12 grid max-w-4xl gap-4">
        {queue.length === 0 ? (
          <p className="text-center text-xl opacity-70">No patients in queue</p>
        ) : (
          queue.map((entry, index) => (
            <div
              key={entry.id}
              className="rounded-xl bg-white/10 px-6 py-4 text-xl font-semibold"
            >
              <span className="mr-4 opacity-70">#{index + 1}</span>
              {entry.patientName} — Token {entry.tokenNumber}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
