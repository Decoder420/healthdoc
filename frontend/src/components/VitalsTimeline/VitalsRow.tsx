import { VitalRecord } from "./VitalsTimeline.types";
import { formatDateTime } from "@/lib/api";

type VitalRowProps = {
  record: VitalRecord;
};

/** An unrecorded measurement renders as absent, never as a number. */
function show(value: string | number | null, unit = ""): string {
  if (value === null || value === "") return "—";
  return unit ? `${value} ${unit}` : String(value);
}

function bloodPressure(record: VitalRecord): string {
  const { bp_systolic: systolic, bp_diastolic: diastolic } = record;
  if (systolic === null || diastolic === null) return "—";
  return `${systolic}/${diastolic}`;
}

export default function VitalRow({ record }: VitalRowProps) {
  return (
    <tr className="border-b border-border last:border-none">
      <td className="px-4 py-3 text-sm">
        {formatDateTime(record.measured_at)}
      </td>

      {/* Celsius — temp_c, validated 20–45 by the API. */}
      <td className="px-4 py-3 text-sm">{show(record.temp_c, "°C")}</td>

      <td className="px-4 py-3 text-sm">{show(record.pulse_bpm, "bpm")}</td>

      <td className="px-4 py-3 text-sm">{show(record.resp_rate, "rpm")}</td>

      <td className="px-4 py-3 text-sm">{bloodPressure(record)}</td>

      <td className="px-4 py-3 text-sm">
        {record.spo2_pct === null ? "—" : `${record.spo2_pct}%`}
      </td>

      <td className="px-4 py-3 text-sm">{show(record.pain_score)}</td>
    </tr>
  );
}
