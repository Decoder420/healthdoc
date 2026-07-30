import { QueueStatus } from "@/features/pharmacy/types";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles: Record<string, string> = {
    Waiting:
      "bg-blue-100 text-blue-700",

    "In Review":
      "bg-orange-100 text-orange-700",

    "On Hold":
      "bg-amber-100 text-amber-800",

    "Clarification Pending":
      "bg-purple-100 text-purple-700",

    Dispensing:
      "bg-cyan-100 text-cyan-700",

    Partial:
      "bg-yellow-100 text-yellow-800",

    Completed:
      "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}