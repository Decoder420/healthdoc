"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { QueueEntry } from "@/features/opd/types";

type OpdQueueContextValue = {
  queue: QueueEntry[];
  addToQueue: (entry: QueueEntry) => void;
  waitingCount: number;
};

const OpdQueueContext = createContext<OpdQueueContextValue | undefined>(
  undefined,
);

const initialQueue: QueueEntry[] = [
  {
    id: "queue-seed-1",
    tokenNumber: "GM-014",
    uhid: "UHID202400913",
    patientName: "Amit Kumar",
    doctorId: "doc-003",
    doctorName: "Dr. Reddy",
    department: "Orthopedics",
    opdId: "OPD20250709001",
    priority: "normal",
    status: "waiting",
    addedAt: new Date().toISOString(),
  },
  {
    id: "queue-seed-2",
    tokenNumber: "CD-007",
    uhid: "UHID202500087",
    patientName: "Priya Patel",
    doctorId: "doc-002",
    doctorName: "Dr. Singh",
    department: "Cardiology",
    opdId: "OPD20250709002",
    priority: "urgent",
    status: "waiting",
    addedAt: new Date().toISOString(),
  },
];

export function OpdQueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<QueueEntry[]>(initialQueue);

  const addToQueue = useCallback((entry: QueueEntry) => {
    setQueue((current) => [entry, ...current]);
  }, []);

  const waitingCount = useMemo(
    () => queue.filter((entry) => entry.status === "waiting").length,
    [queue],
  );

  return (
    <OpdQueueContext.Provider value={{ queue, addToQueue, waitingCount }}>
      {children}
    </OpdQueueContext.Provider>
  );
}

export function useOpdQueue() {
  const context = useContext(OpdQueueContext);
  if (!context) {
    throw new Error("useOpdQueue must be used within OpdQueueProvider");
  }
  return context;
}
