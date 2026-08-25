import { Order, TaskQueueProps } from "./Taskqueue.types";
import { PRIORITY_SORT_ORDER, PRIORITY_STYLES } from "./Taskqueue.constants";

function formatOrderedAt(orderedAt: string): string {
  const date = new Date(orderedAt);
  if (isNaN(date.getTime())) return orderedAt;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatAuditStamp(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isPending(status: Order["status"]): boolean {
  return status !== "completed" && status !== "cancelled";
}

export default function TaskQueue({ orders, onAccept, onCheckOff }: TaskQueueProps) {
  const pendingOrders = orders
    .filter((order) => isPending(order.status))
    .slice()
    .sort((a, b) => PRIORITY_SORT_ORDER[a.priority] - PRIORITY_SORT_ORDER[b.priority]);

  if (pendingOrders.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">No pending orders. All caught up.</p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Pending doctor orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Accept records who picked up the order and when (0045). Complete records
          check-off with authenticated nurse and timestamp.
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
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ordered</th>
              <th className="px-4 py-3 text-left">Accepted</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingOrders.map((order: Order) => {
              const canAccept = order.status === "placed" && Boolean(onAccept);
              const canComplete =
                order.status === "placed" ||
                order.status === "accepted" ||
                order.status === "in_progress";
              const acceptedLabel = formatAuditStamp(order.accepted_at);

              return (
                <tr key={order.id} className="border-b border-border last:border-none">
                  <td className="px-4 py-3 text-sm">
                    {order.order_number ?? order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm">{order.patient_name ?? "-"}</td>
                  <td className="px-4 py-3 text-sm capitalize">{order.order_type}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${PRIORITY_STYLES[order.priority]}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{order.status.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-sm" suppressHydrationWarning>
                    {formatOrderedAt(order.ordered_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground" suppressHydrationWarning>
                    {acceptedLabel ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {canAccept ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => void onAccept?.(order.id)}
                        >
                          Accept
                        </button>
                      ) : null}
                      {canComplete ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => void onCheckOff(order.id)}
                        >
                          Mark completed
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
