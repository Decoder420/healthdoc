import { StatusStep } from "@/components/shared/StatusStepper/types";

export const pathologyWorkflow: StatusStep[] = [
  // ============================
  // QUEUE
  // ============================
  {
    value: "QUEUE",
    label: "Queue",
    color: "default",
    next: "COLLECTED",

    actions: [
      {
        id: "collect",
        label: "Collected",
        nextStatus: "COLLECTED",
        color: "primary",
      },
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

  // ============================
  // RESCHEDULING
  // ============================
  {
    value: "NO_SHOW",
    label: "Rescheduling",
    color: "warning",
    next: "QUEUE",

    alert: {
      severity: "warning",
      message:
        "Patient did not arrive for sample collection. Reschedule the collection.",
    },

    actions: [
      {
        id: "reschedule",
        label: "Reschedule",
        nextStatus: "QUEUE",
        color: "primary",
        requiresConfirmation: true,
      },
    ],
  },

  // ============================
  // COLLECTED
  // ============================
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

  // ============================
  // RECOLLECTION
  // ============================
  {
    value: "RECOLLECTION_REQUIRED",
    label: "Recollection",
    color: "error",
    next: "QUEUE",

    alert: {
      severity: "warning",
      message:
        "Sample rejected. A new sample must be collected.",
    },

    actions: [
      {
        id: "recollect",
        label: "Recollect Sample",
        nextStatus: "QUEUE",
        color: "primary",
        requiresConfirmation: true,
      },
    ],
  },

  // ============================
  // REMOVED
  // ============================
  {
    value: "REMOVED",
    label: "Removed",
    color: "default",
    terminal: true,

    alert: {
      severity: "info",
      message: "Order has been removed from the queue.",
    },
  },
];