import { Chip } from "@mui/material";

export type StatusKind =
  | "scheduled"
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "pending"
  | "approved"
  | "rejected"
  | "dispensed"
  | "default";

const STATUS_COLORS: Record<
  StatusKind,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  scheduled: "info",
  waiting: "warning",
  in_progress: "primary",
  completed: "success",
  cancelled: "error",
  pending: "warning",
  approved: "success",
  rejected: "error",
  dispensed: "success",
  default: "default",
};

type StatusChipProps = {
  status: StatusKind;
  label?: string;
  size?: "small" | "medium";
};

export function StatusChip({ status, label, size = "small" }: StatusChipProps) {
  const display =
    label ??
    status
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <Chip
      label={display}
      size={size}
      color={STATUS_COLORS[status] ?? "default"}
      variant="outlined"
    />
  );
}
