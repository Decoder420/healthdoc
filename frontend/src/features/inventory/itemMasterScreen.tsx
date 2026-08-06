
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import ItemMasterStats from "@/components/dashboard/inventory/products/ItemMaster/ItemMasterStats";
import ItemMasterTable from "@/components/dashboard/inventory/products/ItemMaster/ItemMasterTable";
import ItemMasterViewDialog from "@/components/dashboard/inventory/products/ItemMaster/ItemMasterViewDialog";
import AddItemDialog from "@/components/dashboard/inventory/products/ItemMaster/AddItemDialog";

import {
  itemMasterData,
} from "@/features/inventory/data/itemMasterData";

import type {
  ItemMaster,
} from "@/features/inventory/types/itemMaster";

import {
  supplierData,
} from "@/features/inventory/data/supplierData";

const STORAGE_KEY =
  "hospital_item_master";

export default function ItemMasterScreen() {
  const [items, setItems] =
    useState<ItemMaster[]>([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [addOpen, setAddOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<ItemMaster | null>(null);

  /*
   * Load Item Master
   */
  useEffect(() => {
    const storedItems =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!storedItems) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(itemMasterData)
      );

      setItems(itemMasterData);

      return;
    }

    try {
      const parsedItems: ItemMaster[] =
        JSON.parse(storedItems);

      setItems(parsedItems);
    } catch (error) {
      console.error(
        "Failed to load Item Master:",
        error
      );

      setItems(itemMasterData);
    }
  }, []);

  /*
   * Categories
   */
  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          items.map(
            (item) =>
              item.category
          )
        )
      ),
    ];
  }, [items]);

  /*
   * Filter items
   */
  const filteredItems = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.itemName
          .toLowerCase()
          .includes(query) ||
        item.itemCode
          .toLowerCase()
          .includes(query) ||
        item.brand
          ?.toLowerCase()
          .includes(query) ||
        item.category
          .toLowerCase()
          .includes(query) ||
        item.supplierName
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        item.category ===
          category;

      const matchesStatus =
        status === "All" ||
        (status === "Active" &&
          item.isActive) ||
        (status === "Inactive" &&
          !item.isActive);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    items,
    search,
    category,
    status,
  ]);

  /*
   * Stats
   */
  const totalItems =
    items.length;

  const activeItems =
    items.filter(
      (item) =>
        item.isActive
    ).length;

  const inactiveItems =
    items.filter(
      (item) =>
        !item.isActive
    ).length;

  const categoryCount =
    new Set(
      items.map(
        (item) =>
          item.category
      )
    ).size;

  /*
   * Add Item
   */
  const handleAddItem = (
    item: ItemMaster
  ) => {
    setItems((currentItems) => {
      const updatedItems = [
        ...currentItems,
        item,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          updatedItems
        )
      );

      return updatedItems;
    });

    setAddOpen(false);
  };

  /*
   * View Item
   */
  const handleView = (
    item: ItemMaster
  ) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  /*
   * Reset filters
   */
  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Inventory Management
          </p>

          <h1 className="text-2xl font-bold text-foreground">
            Item Master
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the master information,
            stock rules, suppliers and
            storage details for inventory
            items.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setAddOpen(true)
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />

          Add Item
        </button>
      </div>

      {/* STATS */}

      <ItemMasterStats
        totalItems={totalItems}
        activeItems={activeItems}
        inactiveItems={
          inactiveItems
        }
        categories={
          categoryCount
        }
      />

      {/* FILTERS */}

      <div className="surface-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

          {/* SEARCH */}

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">
              Search Items
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search item, code, brand, supplier..."
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* CATEGORY */}

          <div className="w-full lg:w-52">
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {/* STATUS */}

          <div className="w-full lg:w-44">
            <label className="mb-1 block text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="All">
                All
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* RESET */}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />

            Reset
          </button>
        </div>
      </div>

      {/* RESULT COUNT */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {
              filteredItems.length
            }
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {items.length}
          </span>{" "}
          items
        </p>
      </div>

      {/* TABLE */}

      <ItemMasterTable
        items={filteredItems}
        onView={handleView}
      />

      {/* ADD ITEM */}

      <AddItemDialog
        open={addOpen}
        suppliers={supplierData}
        onClose={() =>
          setAddOpen(false)
        }
        onSave={handleAddItem}
      />

      {/* VIEW ITEM */}

      <ItemMasterViewDialog
        open={viewOpen}
        item={selectedItem}
        onClose={() => {
          setViewOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

