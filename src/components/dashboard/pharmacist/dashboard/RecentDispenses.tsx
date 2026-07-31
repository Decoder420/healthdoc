"use client";

import RecentDispenseRow from "@/components/dashboard/pharmacist/dashboard/RecentDispenseRow";

import { RecentDispense } from "@/features/pharmacy/types/dashboard";

interface Props {
  dispenses: RecentDispense[];
}

export default function RecentDispenses({
  dispenses,
}: Props) {
  return (
    <div className="surface-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Recent Dispenses
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Recently completed pharmacy dispensing transactions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm">
                Receipt No.
              </th>

              <th className="px-4 py-3 text-left text-sm">
                Patient
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Medicines
              </th>

              <th className="px-4 py-3 text-left text-sm">
                Dispensed By
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Time
              </th>

              <th className="px-4 py-3 text-center text-sm">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {dispenses.map((dispense) => (
              <RecentDispenseRow
                key={dispense.id}
                dispense={dispense}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}