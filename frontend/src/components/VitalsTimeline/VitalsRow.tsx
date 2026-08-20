import { VitalRecord } from "./VitalsTimeline.types";

type VitalRowProps = {
  record: VitalRecord;
};

export default function VitalRow({
  record,
}: VitalRowProps) {
  return (
    <tr className="border-b border-border last:border-none">
      <td className="px-4 py-3 text-sm">
        {record.recordedAt}
      </td>

      <td className="px-4 py-3 text-sm">
        {record.temperature} °F
      </td>

      <td className="px-4 py-3 text-sm">
        {record.pulse} bpm
      </td>

      <td className="px-4 py-3 text-sm">
        {record.respiratoryRate} rpm
      </td>

      <td className="px-4 py-3 text-sm">
        {record.bloodPressure}
      </td>

      <td className="px-4 py-3 text-sm">
        {record.oxygenSaturation}%
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {record.recordedBy}
      </td>
    </tr>
  );
}