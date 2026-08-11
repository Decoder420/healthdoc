
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import StockListStats from "@/components/dashboard/inventory/products/StockList/StockListStats";
import StockListTable from "@/components/dashboard/inventory/products/StockList/StockListTable";
import StockListViewDialog from "@/components/dashboard/inventory/products/StockList/StockListViewDialog";

import { warehouseStockData } from "@/features/inventory/data/warehouseStockData";

import type { WarehouseStock } from "@/features/inventory/types/warehouseStock";

const WAREHOUSE_STOCK_KEY = "warehouse_stock";

export default function StockListScreen() {
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [selectedStock, setSelectedStock] =
    useState<WarehouseStock | null>(null);

  const [viewOpen, setViewOpen] = useState(false);

  /*
   * ============================================================
   * LOAD STOCK
   * ============================================================
   *
   * IMPORTANT:
   *
   * Warehouse Stock Entry saves data into:
   *
   * warehouse_stock
   *
   * Stock List reads from the SAME key.
   */
  const loadStock = useCallback(() => {
    try {
      const storedStock = localStorage.getItem(
        WAREHOUSE_STOCK_KEY
      );

      /*
       * If warehouse_stock already exists,
       * ALWAYS use it.
       */
      if (storedStock) {
        const parsedStock = JSON.parse(
          storedStock
        );

        if (Array.isArray(parsedStock)) {
          setStocks(parsedStock);
          return;
        }
      }

      /*
       * Only create initial demo stock if
       * warehouse_stock does not exist.
       */
      localStorage.setItem(
        WAREHOUSE_STOCK_KEY,
        JSON.stringify(warehouseStockData)
      );

      setStocks(warehouseStockData);
    } catch (error) {
      console.error(
        "Failed to load warehouse stock:",
        error
      );

      /*
       * Do not overwrite existing localStorage
       * data with demo data on parsing errors.
       */
      setStocks([]);
    }
  }, []);

  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */
  useEffect(() => {
    loadStock();
  }, [loadStock]);

  /*
   * ============================================================
   * REFRESH WHEN USER RETURNS TO STOCK LIST
   * ============================================================
   *
   * This is important because Warehouse updates
   * localStorage before the user opens Stock List.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadStock();
      }
    };

    const handleFocus = () => {
      loadStock();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [loadStock]);

  /*
   * ============================================================
   * CATEGORIES
   * ============================================================
   */
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        stocks
          .map((stock) => stock.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [stocks]);

  /*
   * ============================================================
   * FILTERED STOCK
   * ============================================================
   */
  const filteredStocks = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return stocks.filter((stock) => {
      const matchesSearch =
        !query ||
        stock.itemName
          .toLowerCase()
          .includes(query) ||
        stock.itemId
          .toLowerCase()
          .includes(query) ||
        (stock.batchNumber ?? "")
          .toLowerCase()
          .includes(query) ||
        (stock.grnNumber ?? "")
          .toLowerCase()
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
   * ============================================================
   * STATS
   * ============================================================
   */
  const stats = useMemo(() => {
    const totalItems = stocks.length;

    const totalQuantity = stocks.reduce(
      (total, stock) =>
        total +
        Number(
          stock.availableQuantity ?? 0
        ),
      0
    );

    const lowStock = stocks.filter(
      (stock) =>
        stock.status === "Low Stock" ||
        stock.status === "Out of Stock"
    ).length;

    const warehouses = new Set(
      stocks.map(
        (stock) => stock.warehouseId
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
   * ============================================================
   * VIEW STOCK
   * ============================================================
   */
  const handleView = (
    stock: WarehouseStock
  ) => {
    setSelectedStock(stock);
    setViewOpen(true);
  };

  /*
   * ============================================================
   * CLOSE VIEW
   * ============================================================
   */
  const handleClose = () => {
    setViewOpen(false);
    setSelectedStock(null);
  };

  /*
   * ============================================================
   * RESET FILTERS
   * ============================================================
   */
  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
  };

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

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

      {/* ======================================================
          STATS
      ====================================================== */}

      <StockListStats
        totalItems={stats.totalItems}
        totalQuantity={stats.totalQuantity}
        lowStock={stats.lowStock}
        warehouses={stats.warehouses}
      />

      {/* ======================================================
          FILTERS
      ====================================================== */}

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

      {/* ======================================================
          RESULT COUNT
      ====================================================== */}

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

      {/* ======================================================
          TABLE
      ====================================================== */}

      <StockListTable
        stocks={filteredStocks}
        onView={handleView}
      />

      {/* ======================================================
          VIEW DIALOG
      ====================================================== */}

      <StockListViewDialog
        open={viewOpen}
        stock={selectedStock}
        onClose={handleClose}
      />
    </div>
  );
}
