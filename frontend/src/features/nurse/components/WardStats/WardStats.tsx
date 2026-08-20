import { WardStatsProps } from "./WardStats.types";

export default function WardStats({ stats }: WardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.id} className="surface-card p-5">
          <p className="text-sm text-muted-foreground">{stat.title}</p>

          <h2 className="mt-3 text-3xl font-bold">{stat.value}</h2>

          <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
        </div>
      ))}
    </section>
  );
}
