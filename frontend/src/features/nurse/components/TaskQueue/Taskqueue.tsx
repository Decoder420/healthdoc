import { Order, TaskQueueProps } from "./Taskqueue.types";
import { PRIORITY_SORT_ORDER, PRIORITY_STYLES } from "./Taskqueue.constants";

function formatOrderedAt(orderedAt: string): string {
  const date = new Date(orderedAt);
  if (isNaN(date.getTime())) return orderedAt;
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TaskQueue({ orders, onCheckOff }: TaskQueueProps) {
  const pendingOrders = orders
    .filter((order) => order.status === "pending")
    .slice()
    .sort((a, b) => PRIORITY_SORT_ORDER[a.priority] - PRIORITY_SORT_ORDER[b.priority]);

  if (pendingOrders.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No pending orders. All caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Task Queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pending doctor orders, sorted by priority.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Ordered At</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingOrders.map((order: Order) => (
              <tr key={order.id} className="border-b border-border last:border-none">
                <td className="px-4 py-3 text-sm">{order.order_number}</td>

                {/* patient_name is not a column on `orders` — see TaskQueue.types.ts note */}
                <td className="px-4 py-3 text-sm">{order.patient_name ?? "-"}</td>

                <td className="px-4 py-3 text-sm capitalize">{order.order_type}</td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${PRIORITY_STYLES[order.priority]}`}
                  >
                    {order.priority}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm" suppressHydrationWarning>
                  {formatOrderedAt(order.ordered_at)}
                </td>

                <td className="px-4 py-3 text-sm">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onCheckOff(order.id)}
                  >
                    Check Off
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
