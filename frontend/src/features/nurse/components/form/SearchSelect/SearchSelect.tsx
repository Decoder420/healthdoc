"use client";

import { useMemo, useState } from "react";

import { SearchSelectProps } from "./SearchSelect.types";

export default function SearchSelect({
  label,
  placeholder = "Search...",
  options,
  value,
  onChange,
}: SearchSelectProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type="text"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          rounded-lg
          border
          border-border
          bg-background
          px-3
          py-2.5
          text-sm
          outline-none
          focus:border-primary
        "
      />

      <div className="max-h-52 overflow-y-auto rounded-lg border border-border">

        {filteredOptions.map((option) => (

          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full border-b border-border px-4 py-3 text-left hover:bg-muted ${
              value === option.value
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            {option.label}
          </button>

        ))}

      </div>

    </div>
  );
}