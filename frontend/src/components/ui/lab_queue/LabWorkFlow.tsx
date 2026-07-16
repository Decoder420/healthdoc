import { StatusStep } from "./StatusStepper/types";

export const pathologyWorkflow: StatusStep[] = [
  {
    value: "QUEUE",
    label: "Queue",
    color: "default",
    next: "COLLECTED",

    actions: [
      {
        id: "no_show",
        label: "No Show",
        nextStatus: "NO_SHOW",
        color: "warning",
        requiresConfirmation: true,
      },
      {
        id: "remove",
        label: "Remove",
        nextStatus: "REMOVED",
        color: "error",
        requiresConfirmation: true,
      },
    ],
  },

  {
    value: "NO_SHOW",
    label: "No Show",
    color: "warning",
    next: "QUEUE",
    alert: {
      severity: "warning",
      message: "Missed collection.",
    },
  },

  {
    value: "COLLECTED",
    label: "Collected",
    color: "info",

    actions: [
      {
        id: "accept",
        label: "Accept Sample",
        nextStatus: "RECEIVED",
        color: "success",
      },
      {
        id: "reject",
        label: "Reject Sample",
        nextStatus: "RECOLLECTION_REQUIRED",
        color: "error",
        requiresReason: true,
        reasons: [
          "Hemolyzed Sample",
          "Wrong Container",
          "Insufficient Quantity",
          "Clotted Sample",
          "Label Mismatch",
        ],
      },
    ],
  },

  {
    value: "RECOLLECTION_REQUIRED",
    label: "Rejected",
    color: "error",
    next: "QUEUE",
    alert: {
      severity: "warning",
      message: "Recollect sample.",
    },
  },

  {
    value: "RECEIVED",
    label: "Received",
    color: "primary",
    next: "PROCESSING",
  },

  {
    value: "PROCESSING",
    label: "Processing",
    color: "warning",
    next: "READY",
  },

  {
    value: "READY",
    label: "Ready",
    color: "success",
    next: "VERIFIED",
  },

  {
    value: "VERIFIED",
    label: "Verified",
    color: "success",
    terminal: true,
  },

  {
    value: "REMOVED",
    label: "Removed",
    color: "default",
    terminal: true,
    alert: {
      severity: "info",
      message: "Removed.",
    },
  },
];