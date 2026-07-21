import { IntakeOutputProps } from "./IntakeOutput.types";

export default function IntakeOutput({
  patient,
  records,
}: IntakeOutputProps) {
  if (!patient) {
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

  return (
    <section className="surface-card overflow-hidden">

      <div className="border-b border-border p-6">
        <h2 className="text-xl font-semibold">
          Intake / Output
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Fluid balance for the selected patient.
        </p>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-muted">

            <tr>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Time
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Intake (ml)
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Output (ml)
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Balance
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Recorded By
              </th>

            </tr>

          </thead>

          <tbody>

            {records.map((record) => (
              <tr
                key={record.id}
                className="border-t border-border"
              >
                <td className="px-4 py-4">
                  {record.recordedAt}
                </td>

                <td className="px-4 py-4">
                  {record.intake}
                </td>

                <td className="px-4 py-4">
                  {record.output}
                </td>

                <td className="px-4 py-4 font-medium">
                  {record.balance}
                </td>

                <td className="px-4 py-4">
                  {record.recordedBy}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}