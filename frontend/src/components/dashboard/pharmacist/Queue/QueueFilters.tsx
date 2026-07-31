"use client";

import { Filter, Search } from "lucide-react";

interface QueueFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
}

export default function QueueFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
}: QueueFiltersProps) {
  return (
    <div className="surface-card p-5">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, UHID or prescription..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2.5"
        >
          <option>All Status</option>
          <option>Waiting</option>
          <option>In Progress</option>
          <option>Partial</option>
          <option>Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2.5"
        >
          <option>All Priority</option>
          <option>Normal</option>
          <option>High</option>
          <option>STAT</option>
        </select>

        <button className="btn btn-outline">
          <Filter size={16} />
          Filters
        </button>
      </div>
    </div>
  );
}