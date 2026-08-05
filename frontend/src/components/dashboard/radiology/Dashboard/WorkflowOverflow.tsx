"use client";

import {
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import {
  appointmentQueue,
} from "@/components/dashboard/radiology/test_queue/DummyData";

const workflowSteps = [
  "Order Received",
  "Scheduled",
  "Patient Arrived",
  "Scan Started",
  "Reporting",
  "Verified",
  "Released",
];

function getActiveStep() {
  const hasVerified = appointmentQueue.some(
    (item) => item.status === "Verified"
  );

  if (hasVerified) return 5;

  const hasReporting = appointmentQueue.some(
    (item) => item.status === "Reporting"
  );

  if (hasReporting) return 4;

  const hasCompleted = appointmentQueue.some(
    (item) => item.status === "Completed"
  );

  if (hasCompleted) return 4;

  const hasScanStarted = appointmentQueue.some(
    (item) => item.status === "Scan Started"
  );

  if (hasScanStarted) return 3;

  const hasQueue = appointmentQueue.some(
    (item) => item.status === "Queue"
  );

  if (hasQueue) return 1;

  return 0;
}

export default function WorkflowOverview() {
  const activeStep = getActiveStep();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Workflow Overview
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
      >
        {workflowSteps.map((label, index) => (
          <Step
            key={label}
            completed={index < activeStep}
          >
            <StepLabel>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}