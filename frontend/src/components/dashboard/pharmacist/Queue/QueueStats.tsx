import StatCard from "./StatCard";

export default function QueueStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Waiting"
        value={24}
        subtitle="Awaiting pharmacist review"
      />

      <StatCard
        title="In Progress"
        value={6}
        subtitle="Currently dispensing"
      />

      <StatCard
        title="Partial"
        value={3}
        subtitle="Pending stock or substitute"
      />

      <StatCard
        title="Completed Today"
        value={41}
        subtitle="Successfully dispensed"
      />
    </div>
  );
}