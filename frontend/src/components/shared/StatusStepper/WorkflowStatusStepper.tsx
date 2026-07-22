"use client";

import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

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
  // Find current status configuration
  const currentStep = workflow.find(
    (step) => step.value === currentStatus
  );

  // Find next status using workflow config
  const nextStep = currentStep?.next
    ? workflow.find(
        (step) => step.value === currentStep.next
      )
    : undefined;

  // Don't show next button for terminal statuses
  const showNextButton =
    showButton &&
    !disabled &&
    !currentStep?.terminal &&
    !!nextStep;

  return (
    <Stack
  spacing={2}
  sx={{
    alignItems: "center",
  }}
>
      {/* Current Status */}
      <StatusChip
        status={currentStatus}
        workflow={workflow}
      />

      {/* Next Status Button */}
      {showNextButton && (
        <Button
  variant="contained"
  color="primary"
  size="small"
  onClick={() =>
    onStatusChange({
      from: currentStatus,
      to: nextStep.value,
    })
  }
  sx={{
    minWidth: 90,
    height: 28,
    px: 1.5,
    py: 0.25,
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: "999px",
    textTransform: "none",
    bgcolor: "#001f54 !important",
    color: "#ffffff !important",
    whiteSpace: "nowrap",
    "&:hover": {
      bgcolor: "#001536 !important",
    },
  }}
>
  {buttonText ?? `Mark ${nextStep.label}`}
</Button>
      )}

      {/* Custom actions (Accept, Reject, Cancel, etc.) */}
      {actions}
    </Stack>
  );
}