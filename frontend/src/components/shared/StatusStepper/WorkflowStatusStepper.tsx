"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import StatusChip from "./StatusChip";
import { WorkflowStatusStepperProps } from "./types";

export default function WorkflowStatusStepper({
  currentStatus,
  workflow,
  onStatusChange,
  disabled = false,
  showButton = true,
  buttonText,
  actions,
}: WorkflowStatusStepperProps) {
  // Current workflow step
  const currentStep = workflow.find(
    (step) => step.value === currentStatus
  );

  // Next workflow step
  const nextStep = currentStep?.next
    ? workflow.find((step) => step.value === currentStep.next)
    : undefined;

  const showNextButton =
    showButton &&
    !disabled &&
    !currentStep?.terminal &&
    Boolean(nextStep);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
    >
      {/* Current Status */}
      <StatusChip
        status={currentStatus}
        workflow={workflow}
      />

      {/* Next Status */}
      {showNextButton && nextStep && (
        <Button
          variant="contained"
          size="small"
          disabled={disabled}
          onClick={() =>
            onStatusChange({
              from: currentStatus,
              to: nextStep.value,
            })
          }
          sx={{
            borderRadius: 5,
            textTransform: "none",
            px: 2,
            minWidth: 120,
          }}
        >
          {buttonText ?? `Mark ${nextStep.label}`}
        </Button>
      )}

      {/* Custom Actions */}
      {actions}
    </Stack>
  );
}