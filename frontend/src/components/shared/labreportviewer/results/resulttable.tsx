import TestGroup from "./testgroup";

interface Props {
  title: string;
  instruments?: string;
  interpretation?: string;
  testGroups: {
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
  }[];
}

export default function ResultsTable({
  title,
  instruments,
  interpretation,
  testGroups,
}: Props) {
  return (
    <section className="drlogy-results relative py-2">
      <div className="drlogy-watermark" aria-hidden>
        <span>ABC</span>
        <span className="text-[11px] tracking-[0.3em]">DIAGNOSTICS</span>
      </div>

      <h2 className="mb-2 text-center text-[18px] font-extrabold text-slate-900">
        {title}
      </h2>

      <table className="relative z-[1] w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="w-[38%] border-y border-slate-800 py-1.5 text-left text-[12px] font-bold text-slate-900">
              Investigation
            </th>
            <th className="w-[22%] border-y border-slate-800 py-1.5 text-center text-[12px] font-bold text-slate-900">
              Result
            </th>
            <th className="w-[24%] border-y border-slate-800 py-1.5 text-center text-[12px] font-bold text-slate-900">
              Reference Value
            </th>
            <th className="w-[16%] border-y border-slate-800 py-1.5 text-center text-[12px] font-bold text-slate-900">
              Unit
            </th>
          </tr>
        </thead>
        <tbody>
          {testGroups.map((group) => (
            <TestGroup key={group.groupId} group={group} />
          ))}
        </tbody>
      </table>

      <div className="relative z-[1] mt-4 space-y-1 border-t border-slate-200 pt-3 text-[11px] text-slate-700">
        {instruments && (
          <p>
            <span className="font-bold text-slate-900">Instruments:</span>{" "}
            {instruments}
          </p>
        )}
        {interpretation && (
          <p>
            <span className="font-bold text-slate-900">Interpretation:</span>{" "}
            {interpretation}
          </p>
        )}
      </div>
    </section>
  );
}
