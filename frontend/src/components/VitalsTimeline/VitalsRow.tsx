import { VitalRecord } from "./VitalsTimeline.types";

type VitalRowProps = {
  record: VitalRecord;
};

function formatMeasuredAt(measuredAt: string): string {
  const date = new Date(measuredAt);
  if (isNaN(date.getTime())) return measuredAt;
  const datePart = date.toLocaleDateString([], { day: "2-digit", month: "short" });
  const timePart = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  return `${datePart}, ${timePart}`;
}

export default function VitalRow({ record }: VitalRowProps) {
  return (
    <tr className="border-b border-border last:border-none">
      <td className="px-4 py-3 text-sm" suppressHydrationWarning>
        {formatMeasuredAt(record.measured_at)}
      </td>
      <td className="px-4 py-3 text-sm">{record.temp_c ?? "-"} °C</td>
      <td className="px-4 py-3 text-sm">{record.pulse_bpm ?? "-"} bpm</td>
      <td className="px-4 py-3 text-sm">{record.resp_rate ?? "-"} rpm</td>
      <td className="px-4 py-3 text-sm">
        {record.bp_systolic ?? "-"}/{record.bp_diastolic ?? "-"}
      </td>
      <td className="px-4 py-3 text-sm">{record.spo2_pct ?? "-"}%</td>
      <td className="px-4 py-3 text-sm">{record.pain_score ?? "-"}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {record.created_by ?? "-"}
      </td>
    </tr>
  );
}
