"use client";

import { useMemo } from "react";

import StatusActionMenu, {
  StatusAction,
} from "./StatusActionMenu";

import {
  StatusStep,
  WorkflowAction,
} from "./types";

interface Props {
  currentStatus: string;

  workflow: StatusStep[];

  disabled?: boolean;

  onAction: (
    action: WorkflowAction
  ) => void;
}

export default function WorkflowStatusAction({
  currentStatus,
  workflow,
  disabled = false,
  onAction,
}: Props) {
  const currentStep = useMemo(
    () =>
      workflow.find(
        (step) =>
          step.value === currentStatus
      ),
    [workflow, currentStatus]
  );

  const actions = useMemo(() => {
    if (!currentStep?.actions) {
      return [];
    }

    return currentStep.actions.map(
      (action): StatusAction => ({
        id: action.id,
        label: action.label,
        color:
          action.color ??
          "primary",
        variant:
          action.variant ??
          "contained",
        disabled,
        requiresReason:
          action.requiresReason,
        requiresConfirmation:
          action.requiresConfirmation,
      })
    );
  }, [currentStep, disabled]);

  return (
    <StatusActionMenu
      actions={actions}
      onAction={(selectedAction) => {
        const action =
          currentStep?.actions?.find(
            (item) =>
              item.id ===
              selectedAction.id
          );

        if (!action) return;

        onAction(action);
      }}
    />
  );
}