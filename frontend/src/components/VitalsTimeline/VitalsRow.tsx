import { VitalRecord } from "./VitalsTimeline.types";

type VitalRowProps = {
  record: VitalRecord;
};

// Formats the ISO timestamp (measured_at) into a readable local date + time,
// e.g. "22 Jul, 8:00 AM". The underlying data stays a full ISO-8601 UTC string
// per the schema — only the display is formatted here.
function formatMeasuredAt(measuredAt: string): string {
  const date = new Date(measuredAt);
  if (isNaN(date.getTime())) return measuredAt; // fallback if value isn't parseable

  const datePart = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });

  const timePart = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart}, ${timePart}`;
}

export default function VitalRow({
  record,
}: VitalRowProps) {
  return (
    <tr className="border-b border-border last:border-none">
      {/* suppressHydrationWarning: toLocaleTimeString's AM/PM casing can differ
          between server (Node) and client (browser) Intl implementations even
          with identical input — this is a known, harmless SSR/CSR mismatch for
          locale-formatted date/time text. See:
          https://nextjs.org/docs/messages/react-hydration-error */}
      <td className="px-4 py-3 text-sm" suppressHydrationWarning>
        {formatMeasuredAt(record.measured_at)}
      </td>

      <td className="px-4 py-3 text-sm">
        {record.temp_c ?? "-"} °C
      </td>

      <td className="px-4 py-3 text-sm">
        {record.pulse_bpm ?? "-"} bpm
      </td>

      <td className="px-4 py-3 text-sm">
        {record.resp_rate ?? "-"} rpm
      </td>

      <td className="px-4 py-3 text-sm">
        {record.bp_systolic ?? "-"}/{record.bp_diastolic ?? "-"}
      </td>

      <td className="px-4 py-3 text-sm">
        {record.spo2_pct ?? "-"}%
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {record.recorded_by ?? "-"}
      </td>
    </tr>
  );
}