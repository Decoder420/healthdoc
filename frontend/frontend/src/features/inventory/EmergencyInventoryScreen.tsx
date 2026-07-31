"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  Search,
  ShieldAlert,
  Siren,
  Stethoscope,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
import {
  EMERGENCY_INVENTORY_CATALOG,
  INITIAL_EMERGENCY_INVENTORY,
  type EmergencyInventoryItem,
  type EmergencyInventoryStatus,
} from "./emergency-inventory-data";

const STATUS_OPTIONS = [
  "All statuses",
  "Available",
  "Low Stock",
  "Near Expiry",
  "Out of Service",
];

function statusClass(status: EmergencyInventoryStatus) {
  if (status === "Available") return "bg-success-muted text-success";
  if (status === "Out of Service") return "bg-danger-muted text-danger";
  return "bg-warning-muted text-warning";
}

function formatExpiry(expiryDate: string | null) {
  if (!expiryDate) return "Not applicable";
  return new Date(`${expiryDate}T00:00:00`).toLocaleDateString("en-IN");
}

export function EmergencyInventoryScreen() {
  const [inventory, setInventory] = useState(INITIAL_EMERGENCY_INVENTORY);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [selected, setSelected] = useState<EmergencyInventoryItem | null>(null);
  const [replenishQuantity, setReplenishQuantity] = useState("1");

  const categories = Object.keys(EMERGENCY_INVENTORY_CATALOG);
  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.itemCode,
          item.name,
          item.category,
          item.batchNumber ?? "",
          item.location,
          item.status,
        ].some((value) => value.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (categoryFilter === "All categories" ||
          item.category === categoryFilter) &&
        (statusFilter === "All statuses" || item.status === statusFilter)
      );
    });
  }, [categoryFilter, inventory, search, statusFilter]);

  const availableCount = inventory.filter(
    (item) => item.status === "Available",
  ).length;
  const lowStockCount = inventory.filter(
    (item) => item.status === "Low Stock",
  ).length;
  const nearExpiryCount = inventory.filter(
    (item) => item.status === "Near Expiry",
  ).length;
  const outOfServiceCount = inventory.filter(
    (item) => item.status === "Out of Service",
  ).length;
  const crashCartReady = inventory
    .filter((item) =>
      ["Emergency Medicines", "Airway & Oxygen Supplies"].includes(
        item.category,
      ),
    )
    .every(
      (item) =>
        item.quantity > 0 &&
        item.status !== "Out of Service" &&
        item.status !== "Low Stock",
    );

  function issueOne(item: EmergencyInventoryItem) {
    if (item.status === "Out of Service" || item.quantity <= 0) {
      toast.error(`${item.name} is unavailable and cannot be issued.`);
      return;
    }
    setInventory((current) =>
      current.map((record) => {
        if (record.id !== item.id) return record;
        const nextQuantity = record.quantity - 1;
        return {
          ...record,
          quantity: nextQuantity,
          status:
            nextQuantity <= record.reorderLevel
              ? "Low Stock"
              : record.status,
        };
      }),
    );
    toast.success(`1 ${item.unit} of ${item.name} issued to Emergency.`);
  }

  function replenishItem() {
    if (!selected) return;
    const amount = Number(replenishQuantity);
    if (!Number.isInteger(amount) || amount <= 0) {
      toast.error("Enter a valid whole-number quantity.");
      return;
    }
    setInventory((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              quantity: item.quantity + amount,
              status:
                item.status === "Near Expiry"
                  ? "Near Expiry"
                  : item.status === "Out of Service"
                    ? "Out of Service"
                    : "Available",
            }
          : item,
      ),
    );
    toast.success(`${selected.name} replenished by ${amount} ${selected.unit}.`);
    setSelected(null);
    setReplenishQuantity("1");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Inventory / Departments
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Emergency Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Readiness tracking for emergency medicines, supplies, equipment,
            PPE, diagnostics, and transport.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
            crashCartReady
              ? "border-success/30 bg-success-muted text-success"
              : "border-warning/30 bg-warning-muted text-warning"
          }`}
        >
          {crashCartReady ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          Crash cart {crashCartReady ? "ready" : "needs attention"}
        </div>
      </header>

      <section
        aria-label="Emergency inventory summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {[
          {
            label: "Inventory records",
            value: inventory.length,
            icon: Siren,
            color: "text-primary",
          },
          {
            label: "Available",
            value: availableCount,
            icon: CheckCircle2,
            color: "text-success",
          },
          {
            label: "Low stock",
            value: lowStockCount,
            icon: AlertTriangle,
            color: "text-warning",
          },
          {
            label: "Near expiry",
            value: nearExpiryCount,
            icon: Activity,
            color: "text-warning",
          },
          {
            label: "Out of service",
            value: outOfServiceCount,
            icon: ShieldAlert,
            color: "text-danger",
          },
        ].map((metric) => (
          <article key={metric.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <metric.icon size={18} className={metric.color} />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section className="surface-card p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Emergency Categories</h2>
          <p className="text-xs text-muted-foreground">
            Select a category to review department readiness and stock.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const records = inventory.filter(
              (item) => item.category === category,
            );
            const attention = records.filter(
              (item) => item.status !== "Available",
            ).length;
            const selectedCategory = categoryFilter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setCategoryFilter((current) =>
                    current === category ? "All categories" : category,
                  )
                }
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selectedCategory
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <Stethoscope size={17} />
                <p className="mt-2 text-xs font-semibold">{category}</p>
                <p
                  className={`mt-1 text-xs ${
                    selectedCategory
                      ? "text-primary-foreground/75"
                      : attention > 0
                        ? "text-warning"
                        : "text-muted-foreground"
                  }`}
                >
                  {records.length} items
                  {attention > 0 ? ` · ${attention} attention` : ""}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {(lowStockCount > 0 ||
        nearExpiryCount > 0 ||
        outOfServiceCount > 0) && (
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-warning/30 bg-warning-muted p-4">
            <p className="font-semibold text-warning">Restock required</p>
            <p className="mt-1 text-sm text-warning">
              {lowStockCount} item(s) are at or below emergency reorder levels.
            </p>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning-muted p-4">
            <p className="font-semibold text-warning">Expiry attention</p>
            <p className="mt-1 text-sm text-warning">
              {nearExpiryCount} medicine or consumable batch(es) are near
              expiry.
            </p>
          </div>
          <div className="rounded-lg border border-danger/30 bg-danger-muted p-4">
            <p className="font-semibold text-danger">Equipment unavailable</p>
            <p className="mt-1 text-sm text-danger">
              {outOfServiceCount} equipment/furniture item(s) require service.
            </p>
          </div>
        </section>
      )}

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold">
              Emergency Stock & Readiness
            </h2>
            <p className="text-xs text-muted-foreground">
              Batch, expiry, location, reorder, and operational status.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(250px,1fr)_230px_180px]">
            <label className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <span className="sr-only">Search emergency inventory</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search item, code, batch..."
                className="h-10 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <FieldSelect
              size="small"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              options={[
                { value: "All categories", label: "All categories" },
                ...categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
            />
            <FieldSelect
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={STATUS_OPTIONS.map((status) => ({
                value: status,
                label: status,
              }))}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Item Code",
                  "Item",
                  "Category",
                  "Available",
                  "Reorder Level",
                  "Batch",
                  "Expiry",
                  "Location",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 font-mono text-xs font-semibold">
                    {item.itemCode}
                  </td>
                  <td className="px-4 py-4 font-semibold">{item.name}</td>
                  <td className="px-4 py-4">{item.category}</td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        item.quantity <= item.reorderLevel
                          ? "font-bold text-danger"
                          : "font-semibold"
                      }
                    >
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {item.reorderLevel} {item.unit}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {item.batchNumber ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    {formatExpiry(item.expiryDate)}
                  </td>
                  <td className="px-4 py-4">{item.location}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-48 gap-2">
                      <Button
                        size="sm"
                        disabled={
                          item.status === "Out of Service" ||
                          item.quantity <= 0
                        }
                        onClick={() => issueOne(item)}
                      >
                        Issue 1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(item)}
                      >
                        <PackagePlus size={14} />
                        Replenish
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInventory.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No emergency inventory matches the selected filters.
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="surface-card p-5">
          <Siren size={20} className="text-danger" />
          <h2 className="mt-3 text-base font-semibold">Code Blue Readiness</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Emergency medicines, airway supplies, defibrillation, and crash-cart
            availability are visible in one registry.
          </p>
        </article>
        <article className="surface-card p-5">
          <Truck size={20} className="text-primary" />
          <h2 className="mt-3 text-base font-semibold">Trauma & Transport</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Stretchers, wheelchairs, spine boards, splints, and trauma supplies
            are tracked by readiness.
          </p>
        </article>
        <article className="surface-card p-5">
          <ShieldAlert size={20} className="text-warning" />
          <h2 className="mt-3 text-base font-semibold">
            Infection & Staff Safety
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            PPE, sharps control, disinfectants, and biomedical waste items are
            monitored for availability.
          </p>
        </article>
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setReplenishQuantity("1");
        }}
        title="Replenish emergency inventory"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setReplenishQuantity("1");
              }}
            >
              Cancel
            </Button>
            <Button onClick={replenishItem}>Confirm replenishment</Button>
          </>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-semibold">{selected?.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Current stock: {selected?.quantity} {selected?.unit} ·{" "}
              {selected?.location}
            </p>
          </div>
          <FieldText
            label="Quantity received"
            type="number"
            value={replenishQuantity}
            onChange={(event) => setReplenishQuantity(event.target.value)}
            inputProps={{ min: 1, step: 1 }}
            fullWidth
            required
          />
        </div>
      </Modal>
    </div>
  );
}
