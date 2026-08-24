import { useState } from "react";
import MedicationRow from "./MedicationRow";
import { MedicationRecord, MedicationStatus } from "./EMARTable.types";
import { api } from "../../../lib/api";

type EMARTableProps = {
  medications: MedicationRecord[];
  admissionId: string;
  patientId: string;
  onUpdated?: () => void;
};

export default function EMARTable({
  medications,
  admissionId,
  patientId,
  onUpdated,
}: EMARTableProps) {
  const [error, setError] = useState<string | null>(null);

  const handleRecordStatus = async (
    prescriptionItemId: string,
    status: MedicationStatus,
    reason?: string
  ) => {
    setError(null);
    try {
      await api("/nursing/medication-administrations", {
        method: "POST",
        body: JSON.stringify({
          prescription_item_id: prescriptionItemId,
          admission_id: admissionId,
          patient_id: patientId,
          status,
          reason,
        }),
      });
      onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record administration");
    }
  };

  if (medications.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">No medication records available.</p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Medication Administration Record</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scheduled and administered medications</p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Medication</th>
              <th className="px-4 py-3 text-left">Dosage</th>
              <th className="px-4 py-3 text-left">Route</th>
              <th className="px-4 py-3 text-left">Scheduled</th>
              <th className="px-4 py-3 text-left">Administered</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {medications.map((medication) => (
              <MedicationRow
                key={medication.id}
                medication={medication}
                onRecordStatus={handleRecordStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}