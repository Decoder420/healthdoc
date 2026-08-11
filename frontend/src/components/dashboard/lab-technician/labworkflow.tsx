"use client";

import {
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";

import { patients } from "@/lib/mock/lab_data";

const workflowSteps = [
  "Order Received",
  "Scheduled",
  "Patient Arrived",
  "Sample Collected",
  "Processing",
  "Verified",
  "Released",
];

function getActiveStep() {
  const hasReleased = patients.some(
    (p) => p.status === "COMPLETED"
  );

  if (hasReleased) return 6;

  const hasVerified = patients.some(
    (p) => p.status === "VERIFIED"
  );

  if (hasVerified) return 5;

  const hasProcessing = patients.some(
    (p) => p.status === "PROCESSING"
  );

  if (hasProcessing) return 4;

  const hasCollected = patients.some(
    (p) => p.status === "COLLECTED"
  );

  if (hasCollected) return 3;

  // Default workflow starts after order creation
  return 2; // Patient Arrived
}

export default function LabWorkflowOverview() {
  const activeStep = getActiveStep();

  return (
    <div className="surface-card p-6">
      <h2 className="mb-3 text-foreground">
        Laboratory Workflow
      </h2>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
      >
        {workflowSteps.map((label, index) => (
          <Step
            key={label}
            completed={index < activeStep}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
