import ResultRow from "./resultrow";

interface Props {
  group: {
    groupId: string;
    groupName: string;
    results: {
      code: string;
      name: string;
      note?: string;
      result: string;
      unit: string;
      referenceRange: string;
      flag: string;
    }[];
  };
  showHeader?: boolean;
}

export default function TestGroup({ group, showHeader = false }: Props) {
  return (
    <>
      {showHeader && (
        <tr>
          <th className="border-y border-slate-800 pb-1.5 pt-2 text-left text-[12px] font-bold text-slate-900">
            Investigation
          </th>
          <th className="border-y border-slate-800 pb-1.5 pt-2 text-center text-[12px] font-bold text-slate-900">
            Result
          </th>
          <th className="border-y border-slate-800 pb-1.5 pt-2 text-center text-[12px] font-bold text-slate-900">
            Reference Value
          </th>
          <th className="border-y border-slate-800 pb-1.5 pt-2 text-center text-[12px] font-bold text-slate-900">
            Unit
          </th>
        </tr>
      )}
      <tr>
        <td
          colSpan={4}
          className="pb-1 pt-3 text-[12px] font-extrabold uppercase tracking-wide text-slate-900"
        >
          {group.groupName}
        </td>
      </tr>
      {group.results.map((item) => (
        <ResultRow key={item.code} result={item} />
      ))}
    </>
  );
}
