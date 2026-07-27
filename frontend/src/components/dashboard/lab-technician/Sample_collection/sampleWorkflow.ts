import { StatusStep } from "@/components/shared/StatusStepper/types";

export const SAMPLE_COLLECTION_WORKFLOW: StatusStep[] = [
  {
    value: "COLLECTED",
    label: "Collected",
    color: "success",

    next: "PROCESSING",

    actions: [
      {
        id: "START_PROCESSING",
        label: "Start Processing",
        nextStatus: "PROCESSING",
        variant: "contained",
        color: "primary",
      },
    ],
  },

  {
    value: "PROCESSING",
    label: "Processing",
    color: "warning",

    terminal: true,
  },
];