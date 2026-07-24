// import { MEDICATION_STATUS_STYLES } from "./constants";
// import { MedicationRecord } from "./EMARTable.types";

// type MedicationRowProps = {
//   medication: MedicationRecord;
// };

// export default function MedicationRow({
//   medication,
// }: MedicationRowProps) {
//   return (
//     <tr className="border-b border-border last:border-none">
//       <td className="px-4 py-3">
//         {medication.medicationName}
//       </td>

//       <td className="px-4 py-3">
//         {medication.dosage}
//       </td>

//       <td className="px-4 py-3">
//         {medication.route}
//       </td>

//       <td className="px-4 py-3">
//         {medication.scheduledTime}
//       </td>

//       <td className="px-4 py-3">
//         {medication.administeredBy ??
//           "-"}
//       </td>

//       <td className="px-4 py-3">
//         <span
//           className={`rounded-full px-2 py-1 text-xs font-medium ${MEDICATION_STATUS_STYLES[medication.status]}`}
//         >
//           {medication.status}
//         </span>
//       </td>
//     </tr>
//   );
// }

import { MEDICATION_STATUS_STYLES } from "./constants";
import { MedicationRecord } from "./EMARTable.types";

type MedicationRowProps = {
  medication: MedicationRecord;
};

export default function MedicationRow({
  medication,
}: MedicationRowProps) {
  return (
    <tr className="border-b border-border last:border-none">
      <td className="px-4 py-3">{medication.medicine_name}</td>
      <td className="px-4 py-3">{medication.dosage ?? "-"}</td>
      <td className="px-4 py-3">{medication.frequency ?? "-"}</td>
      <td className="px-4 py-3">
        {medication.duration_days != null ? `${medication.duration_days} days` : "-"}
      </td>
      <td className="px-4 py-3">{medication.route ?? "-"}</td>
      <td className="px-4 py-3">{medication.instructions ?? "-"}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${MEDICATION_STATUS_STYLES[medication.status]}`}
        >
          {medication.status}
        </span>
      </td>
    </tr>
  );
}