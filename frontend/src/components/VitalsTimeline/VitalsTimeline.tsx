import type { VitalReading } from "./VitalsTimeline.types";

type VitalsTimelineProps = {
  readings: VitalReading[];
  emptyMessage?: string;
};

export function VitalsTimeline({
  readings,
  emptyMessage = "No vitals recorded yet.",
}: VitalsTimelineProps) {
  if (readings.length === 0) {
    return (
      <div className="surface-card p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Time</th>
              <th className="px-4 py-3 text-left font-medium">Temp</th>
              <th className="px-4 py-3 text-left font-medium">Pulse</th>
              <th className="px-4 py-3 text-left font-medium">BP</th>
              <th className="px-4 py-3 text-left font-medium">SpO₂</th>
              <th className="px-4 py-3 text-left font-medium">RR</th>
              <th className="px-4 py-3 text-left font-medium">By</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-b border-border/70">
                <td className="px-4 py-3">{reading.recordedAt}</td>
                <td className="px-4 py-3">{reading.temperature ?? "—"}</td>
                <td className="px-4 py-3">{reading.pulse ?? "—"}</td>
                <td className="px-4 py-3">{reading.bloodPressure ?? "—"}</td>
                <td className="px-4 py-3">{reading.spo2 ?? "—"}</td>
                <td className="px-4 py-3">{reading.respiratoryRate ?? "—"}</td>
                <td className="px-4 py-3">{reading.recordedBy ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VitalsTimeline;
