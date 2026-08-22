import { MEDICATION_STATUS_STYLES } from "./constants";
import { MedicationRecord, MEDICATION_STATUS_LABELS } from "./EMARTable.types";
import { formatDateTime } from "@/lib/api";

type MedicationRowProps = {
  medication: MedicationRecord;
};

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return formatDateTime(iso);
}

export default function MedicationRow({ medication }: MedicationRowProps) {
  const notGiven = medication.status !== "given";

  return (
    <tr className="border-b border-border last:border-none align-top">
      <td className="px-4 py-3">
        {/* An eMAR row that cannot name its drug says so. It does not render
            a UUID, and it does not render blank as though nothing was given. */}
        {medication.medicine_name ?? (
          <span className="text-muted-foreground italic">Unknown medication</span>
        )}
      </td>

      <td className="px-4 py-3">{medication.dosage ?? "—"}</td>

      <td className="px-4 py-3">{medication.route ?? "—"}</td>

      <td className="px-4 py-3">{formatTime(medication.scheduled_at)}</td>

      <td className="px-4 py-3">{formatTime(medication.administered_at)}</td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${MEDICATION_STATUS_STYLES[medication.status]}`}
        >
          {MEDICATION_STATUS_LABELS[medication.status]}
        </span>

        {/* The reason is the point of a held or refused dose — the API
            requires one, so never show the status without it. */}
        {notGiven && medication.reason && (
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {medication.reason}
          </p>
        )}
      </td>
    </tr>
  );
}
