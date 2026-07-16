import ResultFlagLabel from "./resultflag";

interface Result {
  code: string;
  name: string;
  note?: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: string;
}

interface Props {
  result: Result;
}

const valueClass: Record<string, string> = {
  NORMAL: "text-slate-900 font-semibold",
  HIGH: "text-[#d61f26] font-bold",
  LOW: "text-[#1d4ed8] font-bold",
  BORDERLINE: "text-[#ea580c] font-bold",
  CRITICAL: "text-[#d61f26] font-bold",
  PANIC: "text-[#7e22ce] font-bold",
};

export default function ResultRow({ result }: Props) {
  return (
    <tr className="align-top">
      <td className="py-1.5 pr-3">
        <p className="font-medium text-slate-800">{result.name}</p>
        {result.note ? (
          <p className="text-[10px] text-slate-400">({result.note})</p>
        ) : null}
      </td>
      <td className="py-1.5 text-center">
        <span className={valueClass[result.flag] ?? "font-semibold text-slate-900"}>
          {result.result}
        </span>
        <ResultFlagLabel flag={result.flag} />
      </td>
      <td className="py-1.5 text-center text-slate-600">{result.referenceRange}</td>
      <td className="py-1.5 text-center text-slate-600">{result.unit}</td>
    </tr>
  );
}
