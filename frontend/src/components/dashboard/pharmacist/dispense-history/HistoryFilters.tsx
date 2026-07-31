"use client";

import { Search, CalendarDays, Filter, RotateCcw } from "lucide-react";

interface HistoryFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  date: string;
  setDate: (value: string) => void;

  pharmacist: string;
  setPharmacist: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  onReset: () => void;
}



export default function HistoryFilters({
  search,
  setSearch,
  date,
  setDate,
  pharmacist,
  setPharmacist,
  status,
  setStatus,
  onReset
}: HistoryFiltersProps) {

    console.log({
    status,
    setStatus,
    type: typeof setStatus,
  });
  return (
    <div className="surface-card p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {/* Search */}
        <div className="relative">
      <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

       <input
       type="text"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
       placeholder="Search Patient / Receipt / UHID..."
    className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#001F54]"
     />
    </div>

        {/* Date */}
        <div className="relative">
       <CalendarDays
       size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
     />

<input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#001F54]"
/>
  
</div>
        {/* Pharmacist */}
       <select
  value={pharmacist}
  onChange={(e) => setPharmacist(e.target.value)}
  className="
    h-11
    w-full
    rounded-lg
    border
    border-gray-300
    bg-white
    px-4
    text-sm
    text-[#001F54]
    focus:outline-none
    focus:ring-2
    focus:ring-[#001F54]
  "
>
          <option>All Pharmacists</option>
          <option>Anita Sharma</option>
          <option>Rahul Gupta</option>
          <option>Vanshika Aggarwal</option>
        </select>

        {/* Status */}
        <select
 value={status}
  onChange={(e) => setStatus(e.target.value)}

  className="
    h-11
    w-full
    rounded-lg
    border
    border-gray-300
    bg-white
    px-4
    text-sm
    text-[#001F54]
    focus:outline-none
    focus:ring-2
    focus:ring-[#001F54]
  "
>
          <option>All Receipts</option>
          <option>Downloaded</option>
          <option>Printed</option>
          <option>Reprinted</option>
        </select>

        {/* Buttons */}
        
       <div className="flex gap-2">
  <button
    onClick={onReset}
    className="btn btn-outline h-11 flex-1"
  >
    <RotateCcw size={16} />
    Reset
  </button>

  <button
    disabled
    className="btn btn-primary h-11 flex-1 opacity-50 cursor-not-allowed"
  >
    <Filter size={16} />
    Apply
  </button>
</div>
      </div>
    </div>
  );
}