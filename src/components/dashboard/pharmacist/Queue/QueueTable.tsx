import EmptyState from "./EmptyState";
import QueueRow from "./QueueRow";
import { QueueItem } from "@/features/pharmacy/types";


interface QueueTableProps {
  data: QueueItem[];
  onReview: (item: QueueItem) => void;

}
export default function QueueTable({ data, onReview }: QueueTableProps) {
  
  

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-border bg-muted">
            <tr className="text-left">
              <th className="px-5 py-4">Queue</th>

              <th className="px-5 py-4">Patient</th>

              <th className="px-5 py-4">Doctor</th>

              <th className="px-5 py-4">Visit</th>

              <th className="px-5 py-4 text-center">
                Medicines
              </th>

              <th className="px-5 py-4">
                Priority
              </th>

              <th className="px-5 py-4">
                Time
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <QueueRow
                key={item.id}
                item={item}
                onReview={onReview}   // <-- Must be here
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}