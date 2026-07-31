"use client";

import { useRouter } from "next/navigation";

import { QueueItem } from "@/features/pharmacy/types/index";

interface TodayQueueProps {
  queue: QueueItem[];
}

export default function TodayQueue({
  queue,
}: TodayQueueProps) {
  const router = useRouter();

  return (
    <div className="surface-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Today's Prescription Queue
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recently received prescriptions awaiting pharmacist review.
          </p>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() =>
            router.push("/pharmacy/prescription-queue")
          }
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm">
                Queue
              </th>

              <th className="px-4 py-3 text-left text-sm">
                Patient
              </th>

              <th className="px-4 py-3 text-left text-sm">
                Doctor
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Priority
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Status
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {queue.slice(0, 5).map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  {item.queueNumber}
                </td>

                <td className="px-4 py-3">
                  {item.patientName}
                </td>

                <td className="px-4 py-3">
                  {item.doctor}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.priority}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.status}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      router.push(
                        `/pharmacy/prescription-queue?id=${item.id}`
                      )
                    }
                  >
                    Review
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