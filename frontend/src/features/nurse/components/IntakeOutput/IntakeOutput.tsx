import { IntakeOutputProps, EntryType } from "./IntakeOutput.types";

const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  intake_oral: "Oral Intake",
  intake_iv: "IV Intake",
  output_urine: "Urine Output",
  output_drain: "Drain Output",
  output_other: "Other Output",
};

function isIntake(entryType: EntryType): boolean {
  return entryType.startsWith("intake_");
}

export default function IntakeOutput({
  admissionId,
  records,
}: IntakeOutputProps) {
  if (!admissionId) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Select a patient to view intake / output records.
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No intake / output records available.
        </p>
      </div>
    );
  }

  // UI-only aggregate — not a stored field. Each row is a single intake or
  // output entry (per schema), so totals are computed here for a quick summary.
  const totalIntake = records
    .filter((r) => isIntake(r.entry_type))
    .reduce((sum, r) => sum + r.volume_ml, 0);

  const totalOutput = records
    .filter((r) => !isIntake(r.entry_type))
    .reduce((sum, r) => sum + r.volume_ml, 0);

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-border p-6">
        <h2 className="text-xl font-semibold">Intake / Output</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fluid balance for the selected patient.
        </p>

        <div className="mt-4 flex gap-6 text-sm">
          <span>
            Total Intake: <span className="font-semibold">{totalIntake} mL</span>
          </span>
          <span>
            Total Output: <span className="font-semibold">{totalOutput} mL</span>
          </span>
          <span>
            Net Balance:{" "}
            <span className="font-semibold">{totalIntake - totalOutput} mL</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Volume (mL)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-border">
                <td className="px-4 py-4" suppressHydrationWarning>
                  {new Date(record.recorded_at).toLocaleString()}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={
                      isIntake(record.entry_type)
                        ? "rounded-full bg-info-muted px-2 py-1 text-xs font-medium text-info"
                        : "rounded-full bg-warning-muted px-2 py-1 text-xs font-medium text-warning"
                    }
                  >
                    {ENTRY_TYPE_LABELS[record.entry_type]}
                  </span>
                </td>

                <td className="px-4 py-4 font-medium">{record.volume_ml}</td>

                <td className="px-4 py-4 text-muted-foreground">
                  {record.notes ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
