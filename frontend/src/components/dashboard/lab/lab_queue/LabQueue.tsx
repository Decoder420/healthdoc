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

  const [selectedOrderId, setSelectedOrderId] =
    useState<string>("");

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
    setSelectedOrderId("");
  };

  const getPatientByOrderId = (orderId: string) =>
    patients.find(
      (patient) => patient.order.orderId === orderId
    );

  const handleStatusChange = (
    orderId: string,
    payload: StatusChangePayload
  ) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.order.orderId === orderId
          ? {
              ...patient,
              status: payload.to,
            }
          : patient
      )
    );
  };

  const updatePatientStatus = (
    orderId: string,
    action: WorkflowAction,
    reason?: string,
    remarks?: string
  ) => {
    const patient = getPatientByOrderId(orderId);

    if (!patient) return;

    handleStatusChange(orderId, {
      from: patient.status,
      to: action.nextStatus,
      action: action.id,
      reason,
      remarks,
    });

    resetDialogs();
  };

  const handleWorkflowAction = (
    orderId: string,
    action: WorkflowAction
  ) => {
    setSelectedOrderId(orderId);
    setSelectedAction(action);

    if (action.requiresReason) {
      setReasonDialogOpen(true);
      return;
    }

    if (action.requiresConfirmation) {
      setConfirmationDialogOpen(true);
      return;
    }

    updatePatientStatus(orderId, action);
  };

  const handleReasonSubmit = ({
    reason,
    remarks,
  }: {
    reason: string;
    remarks?: string;
  }) => {
    if (!selectedAction || !selectedOrderId) return;

    updatePatientStatus(
      selectedOrderId,
      selectedAction,
      reason,
      remarks
    );
  };

  const handleConfirm = () => {
    if (!selectedAction || !selectedOrderId) return;

    updatePatientStatus(
      selectedOrderId,
      selectedAction
    );
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
        description={`Are you sure you want to ${
          selectedAction?.label ?? ""
        }?`}
        onClose={resetDialogs}
        onConfirm={handleConfirm}
      />
    </>
  );
}