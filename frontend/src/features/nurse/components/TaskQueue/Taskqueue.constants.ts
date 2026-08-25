import { OrderPriority } from "./Taskqueue.types";

export const PRIORITY_SORT_ORDER: Record<OrderPriority, number> = {
  stat: 0,
  urgent: 1,
  routine: 2,
};

export const PRIORITY_STYLES: Record<OrderPriority, string> = {
  stat: "bg-danger-muted text-danger",
  urgent: "bg-warning-muted text-warning",
  routine: "bg-info-muted text-info",
};