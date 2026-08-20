import VitalRow from "./VitalsRow";
import { VitalRecord } from "./VitalsTimeline.types";

type VitalsTimelineProps = {
  records: VitalRecord[];
};

export default function VitalsTimeline({
  records,
}: VitalsTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No vital records available.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">
          Vitals Timeline
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Patient vital recordings
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">
                Time
              </th>

              <th className="px-4 py-3 text-left">
                Temp
              </th>

              <th className="px-4 py-3 text-left">
                Pulse
              </th>

              <th className="px-4 py-3 text-left">
                RR
              </th>

              <th className="px-4 py-3 text-left">
                BP
              </th>

              <th className="px-4 py-3 text-left">
                SpO₂
              </th>

              <th className="px-4 py-3 text-left">
                Recorded By
              </th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <VitalRow
                key={record.id}
                record={record}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}