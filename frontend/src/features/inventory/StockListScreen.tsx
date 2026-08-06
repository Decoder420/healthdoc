
"use client";

import { useEffect, useMemo, useState } from "react";

import StockListStats from "@/components/dashboard/inventory/products/StockList/StockListStats";
import StockListTable from "@/components/dashboard/inventory/products/StockList/StockListTable";
import StockListViewDialog from "@/components/dashboard/inventory/products/StockList/StockListViewDialog";

import { warehouseStockData } from "@/features/inventory/data/warehouseStockData";

import type { WarehouseStock } from "@/features/inventory/types/warehouseStock";

const WAREHOUSE_STOCK_KEY = "warehouse_stock";

export default function StockListScreen() {
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [selectedStock, setSelectedStock] =
    useState<WarehouseStock | null>(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  /*
   * Load stock from localStorage
   */
  useEffect(() => {
    const storedStock =
      localStorage.getItem(
        WAREHOUSE_STOCK_KEY
      );

    if (!storedStock) {
      localStorage.setItem(
        WAREHOUSE_STOCK_KEY,
        JSON.stringify(warehouseStockData)
      );

      setStocks(warehouseStockData);

      return;
    }

    try {
      const parsedStock: WarehouseStock[] =
        JSON.parse(storedStock);

      setStocks(parsedStock);
    } catch (error) {
      console.error(
        "Failed to load warehouse stock:",
        error
      );

      setStocks(warehouseStockData);
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
          stocks.map(
            (stock) => stock.category
          )
        )
      ),
    ];
  }, [stocks]);

  /*
   * Filtered stock
   */
  const filteredStocks = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return stocks.filter((stock) => {
      const matchesSearch =
        !query ||
        stock.itemName
          .toLowerCase()
          .includes(query) ||
        stock.itemId
          .toLowerCase()
          .includes(query) ||
        stock.batchNumber
          .toLowerCase()
          .includes(query) ||
        stock.grnNumber
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        stock.category === category;

      const matchesStatus =
        status === "All" ||
        stock.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    stocks,
    search,
    category,
    status,
  ]);

  /*
   * Stats
   */
  const stats = useMemo(() => {
    const totalItems = stocks.length;

    const totalQuantity =
      stocks.reduce(
        (total, stock) =>
          total +
          stock.availableQuantity,
        0
      );

    const lowStock =
      stocks.filter(
        (stock) =>
          stock.status === "Low Stock" ||
          stock.status === "Out of Stock"
      ).length;

    const warehouses =
      new Set(
        stocks.map(
          (stock) =>
            stock.warehouseId
        )
      ).size;

    return {
      totalItems,
      totalQuantity,
      lowStock,
      warehouses,
    };
  }, [stocks]);

  /*
   * View stock
   */
  const handleView = (
    stock: WarehouseStock
  ) => {
    setSelectedStock(stock);
    setViewOpen(true);
  };

  /*
   * Close dialog
   */
  const handleClose = () => {
    setViewOpen(false);
    setSelectedStock(null);
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

      <div>
        <p className="text-sm font-medium text-primary">
          Inventory Management
        </p>

        <h1 className="text-2xl font-bold text-foreground">
          Stock List
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all stock available
          in the warehouse.
        </p>
      </div>

      {/* STATS */}

      <StockListStats
        totalItems={
          stats.totalItems
        }
        totalQuantity={
          stats.totalQuantity
        }
        lowStock={
          stats.lowStock
        }
        warehouses={
          stats.warehouses
        }
      />

      {/* FILTERS */}

      <div className="surface-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

          {/* SEARCH */}

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search item, batch, GRN..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
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

          <div className="w-full lg:w-52">
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
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="All">
                All
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Near Expiry">
                Near Expiry
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>
          </div>

          {/* RESET */}

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      {/* RESULT COUNT */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredStocks.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {stocks.length}
          </span>{" "}
          stock entries
        </p>
      </div>

      {/* TABLE */}

      <StockListTable
        stocks={filteredStocks}
        onView={handleView}
      />

      {/* VIEW DIALOG */}

      <StockListViewDialog
        open={viewOpen}
        stock={selectedStock}
        onClose={handleClose}
      />
    </div>
  );
}

