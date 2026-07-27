"use client";

import {
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import { workflowSteps } from "./dummyData";

export default function WorkflowOverview() {
  const activeStep = workflowSteps.findIndex(
    (step) => !step.completed
  );

  return (
    <Paper
      elevation={2}
      sx={{
      p: 2,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={500}
        mb={3}
      >
        Workflow Overview
      </Typography>

      <Stepper
        activeStep={
          activeStep === -1
            ? workflowSteps.length
            : activeStep
        }
        alternativeLabel
      >
        {workflowSteps.map((step) => (
          <Step
            key={step.id}
            completed={step.completed}
          >
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}