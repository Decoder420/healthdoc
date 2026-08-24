import { useState } from "react";
import { MEDICATION_STATUS_STYLES } from "./constants";
import { MedicationRecord, MedicationStatus, MEDICATION_STATUS_LABELS } from "./EMARTable.types";

type MedicationRowProps = {
  medication: MedicationRecord;
  onRecordStatus: (
    prescriptionItemId: string,
    status: MedicationStatus,
    reason?: string
  ) => Promise<void>;
};

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default function MedicationRow({ medication, onRecordStatus }: MedicationRowProps) {
  const notGiven = medication.status !== "given";
  const [pendingStatus, setPendingStatus] = useState<"held" | "refused" | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGiven = async () => {
    setSubmitting(true);
    try {
      await onRecordStatus(medication.prescription_item_id, "given");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReason = (status: "held" | "refused") => {
    setPendingStatus(status);
    setReason("");
  };

  const handleSubmitReason = async () => {
    if (!pendingStatus || !reason.trim()) return;
    setSubmitting(true);
    try {
      await onRecordStatus(medication.prescription_item_id, pendingStatus, reason.trim());
      setPendingStatus(null);
      setReason("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <tr className="border-b border-border last:border-none align-top">
      <td className="px-4 py-3">
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

        {notGiven && medication.reason && (
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {medication.reason}
          </p>
        )}
      </td>

      <td className="px-4 py-3">
        {pendingStatus ? (
          <div className="flex flex-col gap-1">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Reason for ${pendingStatus} (required)`}
              className="w-48 rounded border border-border p-1 text-xs"
              rows={2}
            />
            <div className="flex gap-1">
              <button
                type="button"
                disabled={!reason.trim() || submitting}
                onClick={handleSubmitReason}
                className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                className="rounded border border-border px-2 py-1 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-1">
            <button
              type="button"
              disabled={submitting}
              onClick={handleGiven}
              className="rounded bg-green-600 px-2 py-1 text-xs text-white disabled:opacity-50"
            >
              Given
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleOpenReason("held")}
              className="rounded bg-amber-500 px-2 py-1 text-xs text-white disabled:opacity-50"
            >
              Held
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleOpenReason("refused")}
              className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50"
            >
              Refused
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}