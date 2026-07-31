"use client";

import { dispenseHistoryData } from "@/features/pharmacy/data/dispenseHistoryData";
import HistoryRow from "./HistoryRow";

type HistoryTableProps = {
  data: typeof dispenseHistoryData;
};

export default function HistoryTable({ data }: HistoryTableProps) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#001F54] text-white">
            <tr>
              <th className="px-5 py-4 text-left">Receipt No.</th>
              <th className="px-5 py-4 text-left">Patient</th>
              <th className="px-5 py-4 text-left">UHID</th>
              <th className="px-5 py-4 text-left">Prescription</th>
              <th className="px-5 py-4 text-center">Medicines</th>
              <th className="px-5 py-4 text-left">Pharmacist</th>
              <th className="px-5 py-4 text-left">Date</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}