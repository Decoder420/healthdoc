"use client";


import { Eye } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { QueueItem } from "@/features/pharmacy/types";
import { useRouter } from "next/dist/client/components/navigation";

interface QueueRowProps {
  item: QueueItem;
  onReview: (item: QueueItem) => void;
}

export default function QueueRow({ item, onReview }: QueueRowProps) {
     const router = useRouter();
  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40">
      <td className="px-5 py-4 font-medium">
        {item.queueNumber}
      </td>

      <td className="px-5 py-4">
        <div>
          <p className="font-medium text-foreground">
            {item.patientName}
          </p>

          <p className="text-xs text-muted-foreground">
            {item.uhid}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        {item.doctor}
      </td>

      <td className="px-5 py-4">
        {item.visitType}
      </td>

      <td className="px-5 py-4 text-center">
        {item.medicines}
      </td>

      <td className="px-5 py-4">
        <PriorityBadge priority={item.priority} />
      </td>

      <td className="px-5 py-4">
        {item.createdAt}
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={item.status} />
      </td>

      <td className="px-5 py-4">
        <button
        className="btn btn-primary "
        onClick={() => onReview(item)}
      >
        <Eye size={16} />
        Review
      </button>
      </td>
    </tr>
  );
}