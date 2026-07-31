interface Props {
  title: string;
  value: number;
  subtitle: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div className="surface-card p-5">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>

      <p className="mt-1 text-xs text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}