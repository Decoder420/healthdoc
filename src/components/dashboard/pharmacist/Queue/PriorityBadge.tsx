import { QueuePriority } from "@/features/pharmacy/types";

interface Props {
  priority: QueuePriority;
}

export default function PriorityBadge({ priority }: Props) {
  const styles = {
    Normal: "bg-muted text-muted-foreground",
    High: "bg-warning-muted text-warning",
    STAT: "bg-danger-muted text-danger",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}