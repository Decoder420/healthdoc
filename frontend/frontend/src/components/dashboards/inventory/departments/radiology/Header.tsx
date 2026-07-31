"use client";

import { useState } from "react";

import {
  Search,
  Download,
  Filter,
  Plus,
  ChevronRight,
} from "lucide-react";

import AddItemDrawer from "./AddItemDrawer";

interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  brand: string;
  supplier: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
}

interface HeaderProps {
  onAddItem: (item: InventoryItem) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  inventory: InventoryItem[];
}

export default function Header({
  onAddItem,
  search,
  setSearch,
  inventory,
}: HeaderProps) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const suggestions = inventory.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-2 text-sm font-mono text-muted-foreground">
        <span>Inventory</span>

        <ChevronRight size={16} />

        <span>Department</span>

        <ChevronRight size={16} />

        <span className="font-semibold text-primary">
          Radiology
        </span>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Radiology Inventory Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage X-ray films, contrast media, consumables,
            machines and technician assignments.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {/* Suggestions */}
            {search && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSearch(item.itemName)}
                    className="block w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted last:border-0"
                  >
                    <p className="font-medium text-foreground">
                      {item.itemName}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category} • {item.quantity} {item.unit}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter */}
          <button className="btn btn-outline">
            <Filter size={18} />
            Filter
          </button>

          {/* Export */}
          <button className="btn btn-outline">
            <Download size={18} />
            Export
          </button>

          {/* Add Item */}
          <button
            onClick={() => setOpenDrawer(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      <AddItemDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSave={onAddItem}
      />
    </>
  );
}