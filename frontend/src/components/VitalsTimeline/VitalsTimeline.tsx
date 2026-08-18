import VitalRow from "./VitalsRow";
import { VitalRecord } from "./VitalsTimeline.types";
import { VITAL_LABELS } from "./constants";

type VitalsTimelineProps = {
  records: VitalRecord[];
};

export default function VitalsTimeline({ records }: VitalsTimelineProps) {
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
        <h2 className="text-lg font-semibold">Vitals Timeline</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Patient vital recordings
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">{VITAL_LABELS.temp_c}</th>
              <th className="px-4 py-3 text-left">{VITAL_LABELS.pulse_bpm}</th>
              <th className="px-4 py-3 text-left">{VITAL_LABELS.resp_rate}</th>
              <th className="px-4 py-3 text-left">{VITAL_LABELS.blood_pressure}</th>
              <th className="px-4 py-3 text-left">{VITAL_LABELS.spo2_pct}</th>
              <th className="px-4 py-3 text-left">{VITAL_LABELS.pain_score}</th>
              <th className="px-4 py-3 text-left">Recorded By</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <VitalRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
