"use client";

import { useMemo, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type {
  WorkflowAction,
  WorkflowStatusStepperProps,
} from "./types";

interface Props {
  currentStatus: string;
  workflow: WorkflowStatusStepperProps["workflow"];
  onAction: (action: WorkflowAction) => void;
}

export default function WorkflowStatusAction({
  currentStatus,
  workflow,
  onAction,
}: Props) {
  const [confirmAction, setConfirmAction] =
    useState<WorkflowAction | null>(null);

  const actions = useMemo(() => {
    return (
      workflow.find(
        (step) => step.value === currentStatus
      )?.actions ?? []
    );
  }, [workflow, currentStatus]);

  function handleClick(action: WorkflowAction) {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
      return;
    }

    onAction(action);
  }

  function handleConfirm() {
    if (!confirmAction) return;

    onAction(confirmAction);
    setConfirmAction(null);
  }

  function handleCancel() {
    setConfirmAction(null);
  }

  function getIcon(id: string) {
    switch (id) {
      case "START_SCAN":
        return <PlayArrowRoundedIcon fontSize="small" />;

      case "COMPLETE_SCAN":
        return <CheckCircleRoundedIcon fontSize="small" />;

      case "NO_SHOW":
        return <VisibilityOffRoundedIcon fontSize="small" />;

      case "REMOVE":
        return <DeleteOutlineRoundedIcon fontSize="small" />;

      default:
        return null;
    }
  }

  function getVariant(action: WorkflowAction) {
    if (
      action.id === "START_SCAN" ||
      action.id === "COMPLETE_SCAN"
    ) {
      return "contained";
    }

    if (action.id === "REMOVE") {
      return "text";
    }

    return "outlined";
  }

  function getColor(action: WorkflowAction) {
    if (action.id === "REMOVE") {
      return "error";
    }

    if (action.id === "NO_SHOW") {
      return "warning";
    }

    return "primary";
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={0.75}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
      >
        {actions.map((action) => (
          <Button
            key={action.id}
            size="small"
            disableElevation
            variant={getVariant(action)}
            color={getColor(action)}
            startIcon={getIcon(action.id)}
            onClick={() => handleClick(action)}
            sx={{
              height: 30,
              minWidth:
                action.id === "START_SCAN" ||
                action.id === "COMPLETE_SCAN"
                  ? 90
                  : 72,
              px: 1.25,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "none",

              "& .MuiButton-startIcon": {
                marginRight: 0.5,
              },

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {action.label}
          </Button>
        ))}
      </Stack>

      <Dialog
        open={Boolean(confirmAction)}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Confirm Action
        </DialogTitle>

        <DialogContent>
          Are you sure you want to{" "}
          <strong>{confirmAction?.label}</strong>?
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            size="small"
            variant="contained"
            color={
              confirmAction?.id === "REMOVE"
                ? "error"
                : "primary"
            }
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}