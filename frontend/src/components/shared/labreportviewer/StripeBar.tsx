export default function StripeBar({
  rightLabel,
  className = "",
}: {
  rightLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={`drlogy-stripe flex h-7 items-stretch overflow-hidden ${className}`}
    >
      <div className="drlogy-stripe-pattern w-[42%] shrink-0" />
      <div className="flex flex-1 items-center justify-end bg-[#0b2f6b] px-3">
        {rightLabel ? (
          <span className="text-[11px] font-semibold tracking-wide text-white">
            {rightLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
