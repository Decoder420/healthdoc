"use client";

import { useMemo, useState } from "react";
import type { IpdAdmissionRequest, IpdRequestStatus } from "@/features/ipd/types";
import {
  IPD_REQUEST_STATUS_LABELS,
  IPD_REQUEST_TYPE_LABELS,
} from "@/features/ipd/types";
import { filterIpdRequests, getAllIpdRequests } from "@/features/ipd/api";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";
import { AssignIpdResourcesPanel } from "@/components/ipd/assign-ipd-resources-panel";

type IpdRequestInboxProps = {
  refreshKey?: number;
  onChanged?: () => void;
  doctorIdFilter?: string;
  nurseIdFilter?: string;
};

function statusClass(status: IpdRequestStatus) {
  switch (status) {
    case "pending":
      return "text-warning";
    case "assigned":
      return "text-info";
    case "in_progress":
      return "text-primary";
    case "completed":
      return "text-success";
    case "cancelled":
      return "text-danger";
    default:
      return "text-muted-foreground";
  }
}

export function IpdRequestInbox({
  refreshKey = 0,
  onChanged,
  doctorIdFilter,
  nurseIdFilter,
}: IpdRequestInboxProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<IpdRequestStatus | "all">(
    doctorIdFilter || nurseIdFilter ? "all" : "pending",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const requests = useMemo(() => {
    void refreshKey;
    void tick;
    let list = filterIpdRequests({
      query,
      status,
      doctorId: doctorIdFilter ?? "all",
    });
    if (nurseIdFilter) {
      list = list.filter((item) => item.nurseId === nurseIdFilter);
    }
    return list;
  }, [query, status, refreshKey, tick, nurseIdFilter, doctorIdFilter]);

  const selected =
    getAllIpdRequests().find((item) => item.id === selectedId) ?? null;

  function refresh(next?: IpdAdmissionRequest) {
    setTick((value) => value + 1);
    onChanged?.();
    if (next) setSelectedId(next.id);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Doctor IPD Requests
        </h2>
        <p className="text-xs text-muted-foreground">
          Receive doctor requests, then assign ward bed and nurse to the patient.
        </p>
      </div>

      <div className="surface-card grid gap-4 p-5 md:grid-cols-3">
        <div className="md:col-span-2">
          <FieldText
            label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Patient, UHID, doctor, notes..."
          />
        </div>
        <FieldSelect
          label="Status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as IpdRequestStatus | "all")
          }
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending Assignment" },
            { value: "assigned", label: "Assigned" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Request</th>
                  <th className="px-5 py-3 font-medium">Doctor</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-muted-foreground"
                    >
                      No IPD requests in this filter.
                    </td>
                  </tr>
                ) : (
                  requests.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        selectedId === item.id
                          ? "bg-accent/40"
                          : "hover:bg-muted/40"
                      }
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">
                          {item.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.uhid}
                          {item.tokenNumber !== "—"
                            ? ` · ${item.tokenNumber}`
                            : ""}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-foreground">
                          {IPD_REQUEST_TYPE_LABELS[item.type]}
                        </p>
                        <p className="max-w-56 truncate text-xs text-muted-foreground">
                          {item.clinicalNotes}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-foreground">
                        {item.doctorName}
                      </td>
                      <td
                        className={`px-5 py-3.5 font-medium ${statusClass(item.status)}`}
                      >
                        {IPD_REQUEST_STATUS_LABELS[item.status]}
                      </td>
                      <td className="px-5 py-3.5">
                        <Button
                          type="button"
                          size="sm"
                          variant={selectedId === item.id ? "primary" : "outline"}
                          onClick={() => setSelectedId(item.id)}
                        >
                          {item.status === "pending" ? "Assign" : "Manage"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected ? (
          <AssignIpdResourcesPanel
            key={`${selected.id}-${selected.updatedAt}`}
            request={selected}
            onClose={() => setSelectedId(null)}
            onUpdated={refresh}
          />
        ) : (
          <div className="surface-card flex min-h-64 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Select a doctor request to assign ward bed, nurse, and care instructions.
          </div>
        )}
      </div>
    </div>
  );
}
