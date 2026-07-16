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
  const currentStatus = workflow.find(
    (step) => step.value === status
  );

  if (!currentStatus?.alert) {
    return null;
  }

  return (
    <Alert
      severity={currentStatus.alert.severity}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        maxWidth: 220,
        minHeight: 32,
        px: 1,
        py: 0.5,
        mx: "auto",
        borderRadius: 2,

        "& .MuiAlert-icon": {
          alignSelf: "center",
          mr: 0.75,
          fontSize: 18,
        },

        "& .MuiAlert-message": {
          width: "100%",
          py: 0,
          textAlign: "center",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          width: "100%",
          textAlign: "center",
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        {currentStatus.alert.message}
      </Typography>

      {reason && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            width: "100%",
            mt: 0.5,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Reason: {reason}
        </Typography>
      )}
    </Alert>
  );
}