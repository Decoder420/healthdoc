// import MedicationRow from "./MedicationRow";
// import { MedicationRecord } from "./EMARTable.types";

// type EMARTableProps = {
//   medications: MedicationRecord[];
// };

// export default function EMARTable({
//   medications,
// }: EMARTableProps) {
//   if (medications.length === 0) {
//     return (
//       <div className="surface-card p-6">
//         <p className="text-sm text-muted-foreground">
//           No medication records available.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="surface-card overflow-hidden">
//       <div className="border-b border-border px-6 py-4">
//         <h2 className="text-lg font-semibold">
//           Medication Administration Record
//         </h2>

//         <p className="mt-1 text-sm text-muted-foreground">
//           Scheduled and administered medications
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-muted">
//             <tr>
//               <th className="px-4 py-3 text-left">
//                 Medication
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Dosage
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Route
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Scheduled
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Administered By
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Status
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {medications.map((medication) => (
//               <MedicationRow
//                 key={medication.id}
//                 medication={medication}
//               />
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import MedicationRow from "./MedicationRow";
import { MedicationRecord } from "./EMARTable.types";

type EMARTableProps = {
  medications: MedicationRecord[];
};

export default function EMARTable({
  medications,
}: EMARTableProps) {
  if (medications.length === 0) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          No medication records available.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">
          Medication Administration Record
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Scheduled and administered medications
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">
                Medication
              </th>

              <th className="px-4 py-3 text-left">
                Dosage
              </th>

              <th className="px-4 py-3 text-left">
                Route
              </th>

              <th className="px-4 py-3 text-left">
                Scheduled
              </th>

              <th className="px-4 py-3 text-left">
                Administered By
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {medications.map((medication) => (
              <MedicationRow
                key={medication.id}
                medication={medication}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}