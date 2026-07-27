"use client";

import Stack from "@mui/material/Stack";

import StatusChip from "./StatusChip";
import { WorkflowStatusStepperProps } from "./types";

export default function WorkflowStatusStepper({
  currentStatus,
  workflow,
  actions,
}: WorkflowStatusStepperProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        minHeight: 30,
      }}
    >
      <StatusChip
        status={currentStatus}
        workflow={workflow}
      />

      {actions}
    </Stack>
  );
}