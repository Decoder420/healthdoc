import { StatusStep } from "@/components/shared/StatusStepper/types";

export const SAMPLE_COLLECTION_WORKFLOW: StatusStep[] = [
  {
    value: "COLLECTED",
    label: "Collected",
    color: "success",
    next: "PROCESSING",
  },
  {
    value: "PROCESSING",
    label: "Processing",
    color: "warning",
    terminal: true,
  },
];