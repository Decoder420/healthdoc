"use client";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import { StatusStep } from "./types";

interface StatusAlertProps {
  status: string;
  workflow: StatusStep[];
  reason?: string;
}

export default function StatusAlert({
  status,
  workflow,
  reason,
}: StatusAlertProps) {
  const currentStep = workflow.find(
    (step) => step.value === status
  );

  if (!currentStep?.alert) {
    return null;
  }

  return (
    <Alert
      severity={currentStep.alert.severity}
      variant="outlined"
      sx={{
        mt: 0.5,

        py: 0,

        px: 1,

        minHeight: 28,

        borderRadius: 2,

        fontSize: 11,

        alignItems: "center",

        "& .MuiAlert-icon": {
          fontSize: 16,
          mr: 0.75,
          py: 0,
        },

        "& .MuiAlert-message": {
          py: "2px",
          width: "100%",
        },
      }}
    >
      <Typography
        variant="caption"
        fontWeight={600}
      >
        {currentStep.alert.message}
      </Typography>

      {reason && (
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
        >
          {reason}
        </Typography>
      )}
    </Alert>
  );
}