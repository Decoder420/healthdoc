"use client";

import { useState } from "react";

import PatientQueueTable, {
  PatientData,
} from "@/components/dashboard/lab/lab_queue/PatientQueueTable";

import {
  StatusChangePayload,
  WorkflowAction,
} from "@/components/shared/StatusStepper/types";

import ConfirmationDialog from "@/components/shared/StatusStepper/dialog/ConfirmationDialog";
import ReasonSelectionDialog, {
  ReasonOption,
} from "@/components/shared/StatusStepper/dialog/ReasonSelectionDialog";

interface Props {
  initialPatients: PatientData[];
}

export default function PathologyQueueClient({
  initialPatients,
}: Props) {
  const [patients, setPatients] = useState(initialPatients);

  const [selectedPatientId, setSelectedPatientId] = useState("");

  const [selectedAction, setSelectedAction] =
    useState<WorkflowAction | null>(null);

  const [reasonDialogOpen, setReasonDialogOpen] =
    useState(false);

  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState(false);

  const resetDialogs = () => {
    setReasonDialogOpen(false);
    setConfirmationDialogOpen(false);
    setSelectedAction(null);
    setSelectedPatientId("");
  };

  const handleStatusChange = (
    patientId: string,
    payload: StatusChangePayload
  ) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.patient.patientId === patientId
          ? {
              ...patient,
              status: payload.to,
            }
          : patient
      )
    );
  };

  const handleWorkflowAction = (
    patientId: string,
    action: WorkflowAction
  ) => {
    setSelectedPatientId(patientId);
    setSelectedAction(action);

    if (action.requiresReason) {
      setReasonDialogOpen(true);
      return;
    }

    if (action.requiresConfirmation) {
      setConfirmationDialogOpen(true);
      return;
    }

    handleStatusChange(patientId, {
      from: "",
      to: action.nextStatus,
      action: action.id,
    });

    resetDialogs();
  };

  const handleReasonSubmit = ({
    reason,
    remarks,
  }: {
    reason: string;
    remarks?: string;
  }) => {
    if (!selectedAction) return;

    handleStatusChange(selectedPatientId, {
      from: "",
      to: selectedAction.nextStatus,
      action: selectedAction.id,
      reason,
      // remarks,
    });

    resetDialogs();
  };

  const handleConfirm = () => {
    if (!selectedAction) return;

    handleStatusChange(selectedPatientId, {
      from: "",
      to: selectedAction.nextStatus,
      action: selectedAction.id,
    });

    resetDialogs();
  };

  const reasonOptions: ReasonOption[] =
    selectedAction?.reasons?.map((reason) => ({
      label: reason,
      value: reason,
    })) ?? [];

  return (
    <>
      <PatientQueueTable
        patients={patients}
        onStatusChange={handleStatusChange}
        onWorkflowAction={handleWorkflowAction}
      />

      <ReasonSelectionDialog
        open={reasonDialogOpen}
        title="Select Reason"
        reasons={reasonOptions}
        onClose={resetDialogs}
        onConfirm={handleReasonSubmit}
      />

      <ConfirmationDialog
        open={confirmationDialogOpen}
        title="Confirmation"
        description={`Are you sure you want to ${selectedAction?.label ?? ""}?`}
        onClose={resetDialogs}
        onConfirm={handleConfirm}
      />
    </>
  );
}