"use client";

import { useMemo, useState } from "react";
import type { IpdAdmissionRequest } from "@/features/ipd/types";
import {
  IPD_REQUEST_STATUS_LABELS,
  IPD_REQUEST_TYPE_LABELS,
} from "@/features/ipd/types";
import {
  assignResourcesToIpdRequest,
  cancelIpdRequest,
  completeIpdRequest,
  getAllIpdNurses,
  getPreferredBedsForIpdRequest,
  startIpdCare,
} from "@/features/ipd/api";
import { FieldSelect, FieldText, FormSection } from "@/components/ui/mui-field";
import { Button } from "@/components/ui/button";

type AssignIpdResourcesPanelProps = {
  request: IpdAdmissionRequest;
  onClose: () => void;
  onUpdated: (request: IpdAdmissionRequest) => void;
};

export function AssignIpdResourcesPanel({
  request,
  onClose,
  onUpdated,
}: AssignIpdResourcesPanelProps) {
  const beds = useMemo(() => getPreferredBedsForIpdRequest(request), [request]);
  const nurses = useMemo(
    () => getAllIpdNurses().filter((nurse) => nurse.status !== "off_duty"),
    [],
  );

  const [bedId, setBedId] = useState(request.bedId || beds[0]?.id || "");
  const [nurseId, setNurseId] = useState(request.nurseId || nurses[0]?.id || "");
  const [instructions, setInstructions] = useState(request.instructions);
  const [error, setError] = useState("");

  function handleAssign() {
    const result = assignResourcesToIpdRequest(request.id, {
      bedId,
      nurseId,
      instructions,
    });
    if (!result.success) {
      setError(result.error);
      return;
    }
    onUpdated(result.data);
    setError("");
  }

  function handleStart() {
    const result = startIpdCare(request.id);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onUpdated(result.data);
  }

  function handleComplete() {
    const result = completeIpdRequest(request.id);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onUpdated(result.data);
  }

  function handleCancel() {
    const result = cancelIpdRequest(request.id);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onUpdated(result.data);
  }

  return (
    <div className="surface-card space-y-5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Assign Bed & Nurse</p>
          <h2 className="text-xl font-semibold text-foreground">
            {request.patientName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {IPD_REQUEST_TYPE_LABELS[request.type]} ·{" "}
            {IPD_REQUEST_STATUS_LABELS[request.status]}
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-muted/30 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Patient</p>
          <p className="font-medium text-foreground">
            {request.uhid} · {request.patientPhone || "No phone"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Doctor</p>
          <p className="font-medium text-foreground">
            {request.doctorName} · {request.department}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs text-muted-foreground">Clinical notes</p>
          <p className="font-medium text-foreground">{request.clinicalNotes}</p>
        </div>
        {request.nurseName && (
          <div>
            <p className="text-xs text-muted-foreground">Assigned nurse</p>
            <p className="font-medium text-foreground">{request.nurseName}</p>
          </div>
        )}
        {request.bedLabel && (
          <div>
            <p className="text-xs text-muted-foreground">Assigned bed</p>
            <p className="font-medium text-foreground">
              {request.bedLabel} · {request.ward}
            </p>
          </div>
        )}
      </div>

      {(request.status === "pending" || request.status === "assigned") && (
        <FormSection
          title="Ward bed & nurse"
          description="Allocate inpatient bed and responsible nurse."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FieldSelect
              label="Ward Bed"
              value={bedId}
              onChange={(event) => setBedId(event.target.value)}
              options={[
                {
                  value: "",
                  label: beds.length ? "Select bed" : "No beds available",
                },
                ...beds.map((bed) => ({
                  value: bed.id,
                  label: `${bed.label} · ${bed.ward} (${bed.careType.replace("_", " ")})`,
                })),
                ...(request.bedId &&
                !beds.some((bed) => bed.id === request.bedId)
                  ? [
                      {
                        value: request.bedId,
                        label: `${request.bedLabel} (current)`,
                      },
                    ]
                  : []),
              ]}
            />
            <FieldSelect
              label="Assign Nurse"
              value={nurseId}
              onChange={(event) => setNurseId(event.target.value)}
              options={[
                { value: "", label: "Select nurse" },
                ...nurses.map((nurse) => ({
                  value: nurse.id,
                  label: `${nurse.name} · ${nurse.ward} · ${nurse.status}${
                    nurse.activeAssignments
                      ? ` (${nurse.activeAssignments} active)`
                      : ""
                  }`,
                })),
              ]}
            />
            <div className="md:col-span-2">
              <FieldText
                label="Care instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                multiline
                minRows={2}
                placeholder="Vitals frequency, diet, isolation, shift notes..."
              />
            </div>
          </div>
        </FormSection>
      )}

      <div className="flex flex-wrap gap-2">
        {(request.status === "pending" || request.status === "assigned") && (
          <Button type="button" onClick={handleAssign}>
            {request.status === "pending"
              ? "Assign Bed & Nurse"
              : "Update Assignment"}
          </Button>
        )}
        {request.status === "assigned" && (
          <Button type="button" variant="secondary" onClick={handleStart}>
            Start Care
          </Button>
        )}
        {(request.status === "assigned" || request.status === "in_progress") && (
          <Button type="button" variant="success" onClick={handleComplete}>
            Discharge / Complete
          </Button>
        )}
        {request.status !== "completed" && request.status !== "cancelled" && (
          <Button type="button" variant="danger" onClick={handleCancel}>
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
}
