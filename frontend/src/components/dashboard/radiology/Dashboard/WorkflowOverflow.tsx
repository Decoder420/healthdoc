"use client";

import {
  Step,
  StepLabel,
  Stepper,
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
  const hasReleased = appointmentQueue.some(
    (item) => item.status === "Released"
  );

  if (hasReleased) return 6;

  const hasVerified = appointmentQueue.some(
    (item) => item.status === "Verified"
  );

  if (hasVerified) return 5;

  const hasReporting = appointmentQueue.some(
    (item) => item.status === "Reporting"
  );

  if (hasReporting) return 4;

  const hasScanStarted = appointmentQueue.some(
    (item) => item.status === "Scan Started"
  );

  if (hasScanStarted) return 3;

  const hasQueue = appointmentQueue.some(
    (item) => item.status === "Queue"
  );

  if (hasQueue) return 1;

  // Default workflow starts after order creation
  return 2; // Patient Arrived
}

export default function WorkflowOverview() {
  const activeStep = getActiveStep();

  return (
    <div className="surface-card p-6">
      <h2 className="mb-3 text-foreground">
        Radiology Workflow
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
