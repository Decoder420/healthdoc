"use client";

import { useMemo, useState } from "react";
import {
  getAllIpdBeds,
  getAllIpdNurses,
  markIpdBedAvailable,
} from "@/features/ipd/api";
import { Button } from "@/components/ui/button";

type IpdResourcesBoardProps = {
  refreshKey?: number;
  onChanged?: () => void;
};

function bedStatusClass(status: string) {
  switch (status) {
    case "available":
      return "border-success/40 bg-success-muted/40 text-success";
    case "occupied":
      return "border-warning/40 bg-warning-muted/40 text-warning";
    case "cleaning":
      return "border-info/40 bg-info-muted/40 text-info";
    case "blocked":
      return "border-danger/40 bg-danger-muted/40 text-danger";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export function IpdResourcesBoard({
  refreshKey = 0,
  onChanged,
}: IpdResourcesBoardProps) {
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");

  const beds = useMemo(() => {
    void refreshKey;
    void tick;
    return getAllIpdBeds();
  }, [refreshKey, tick]);

  const nurses = useMemo(() => {
    void refreshKey;
    void tick;
    return getAllIpdNurses();
  }, [refreshKey, tick]);

  function handleMarkReady(bedId: string) {
    const result = markIpdBedAvailable(bedId);
    if (!result.success) {
      setMessage(result.error);
      return;
    }
    setMessage(`${result.data.label} marked available.`);
    setTick((value) => value + 1);
    onChanged?.();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Ward Beds & Nurses
        </h2>
        <p className="text-xs text-muted-foreground">
          General, private, ICU, and observation beds for IPD care.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Beds</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {beds.map((bed) => (
            <div
              key={bed.id}
              className={`rounded-lg border p-4 ${bedStatusClass(bed.status)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold">{bed.label}</p>
                  <p className="text-xs opacity-80">
                    {bed.ward} · {bed.careType.replace("_", " ")}
                  </p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {bed.status}
                </span>
              </div>
              {bed.currentPatientName ? (
                <p className="mt-3 text-sm">Patient: {bed.currentPatientName}</p>
              ) : (
                <p className="mt-3 text-sm opacity-80">No patient assigned</p>
              )}
              {bed.status === "cleaning" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => handleMarkReady(bed.id)}
                >
                  Mark Ready
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Nurses</h3>
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Nurse</th>
                  <th className="px-5 py-3 font-medium">Ward</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {nurses.map((nurse) => (
                  <tr key={nurse.id}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-foreground">{nurse.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {nurse.employeeId}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">{nurse.ward}</td>
                    <td className="px-5 py-3.5 capitalize text-foreground">
                      {nurse.status.replace("_", " ")}
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      {nurse.activeAssignments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
