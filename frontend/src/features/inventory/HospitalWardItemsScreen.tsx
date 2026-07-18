"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  BedDouble,
  Boxes,
  ClipboardList,
  PackageCheck,
  QrCode,
  RefreshCcw,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";

type WardItem = {
  id: string;
  itemName: string;
  category: "Bed" | "Equipment" | "Furniture" | "Patient Care";
  assetTag?: string;
  quantity: number;
  spareQuantity: number;
  unit: string;
  storageLocation: string;
  condition: "New" | "Good" | "Needs Repair" | "For Disposal";
  lastProcured: string;
  unitCost: number;
};

type RequestRecord = {
  id: string;
  type: "Distribution" | "Replacement" | "Disposal";
  itemName: string;
  ward: string;
  quantity: number;
  reason: string;
  status: "Pending" | "Completed";
  createdAt: string;
};

type Operation = RequestRecord["type"];

const INITIAL_ITEMS: WardItem[] = [
  {
    id: "ward-1",
    itemName: "Motorized ICU Bed",
    category: "Bed",
    assetTag: "HWI-BED-00418",
    quantity: 18,
    spareQuantity: 3,
    unit: "beds",
    storageLocation: "Central Store / Bay A1",
    condition: "New",
    lastProcured: "2026-06-18",
    unitCost: 128000,
  },
  {
    id: "ward-2",
    itemName: "Bedside Monitor",
    category: "Equipment",
    assetTag: "HWI-MON-00291",
    quantity: 12,
    spareQuantity: 2,
    unit: "units",
    storageLocation: "Biomedical Store / Shelf 04",
    condition: "Good",
    lastProcured: "2026-04-10",
    unitCost: 86500,
  },
  {
    id: "ward-3",
    itemName: "Manual Hospital Bed",
    category: "Bed",
    assetTag: "HWI-BED-00176",
    quantity: 26,
    spareQuantity: 5,
    unit: "beds",
    storageLocation: "Central Store / Bay A3",
    condition: "Good",
    lastProcured: "2025-12-22",
    unitCost: 42000,
  },
  {
    id: "ward-4",
    itemName: "Patient Wheelchair",
    category: "Patient Care",
    assetTag: "HWI-WCH-00115",
    quantity: 9,
    spareQuantity: 1,
    unit: "chairs",
    storageLocation: "Ward Supply Store / Zone B",
    condition: "Needs Repair",
    lastProcured: "2025-10-08",
    unitCost: 14500,
  },
  {
    id: "ward-5",
    itemName: "Bedside Locker",
    category: "Furniture",
    quantity: 35,
    spareQuantity: 8,
    unit: "lockers",
    storageLocation: "Furniture Store / Row C2",
    condition: "New",
    lastProcured: "2026-07-02",
    unitCost: 9200,
  },
  {
    id: "ward-6",
    itemName: "IV Stand",
    category: "Patient Care",
    assetTag: "HWI-IVS-00382",
    quantity: 42,
    spareQuantity: 10,
    unit: "stands",
    storageLocation: "Ward Supply Store / Zone A",
    condition: "For Disposal",
    lastProcured: "2024-11-16",
    unitCost: 2800,
  },
];

const WARDS = [
  "General Ward",
  "ICU",
  "Emergency Ward",
  "Pediatric Ward",
  "Maternity Ward",
  "Surgical Ward",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function conditionClass(condition: WardItem["condition"]) {
  if (condition === "New" || condition === "Good") {
    return "bg-success-muted text-success";
  }
  if (condition === "Needs Repair") {
    return "bg-warning-muted text-warning";
  }
  return "bg-danger-muted text-danger";
}

export function HospitalWardItemsScreen() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<WardItem | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [ward, setWard] = useState(WARDS[0]);
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.itemName,
          item.category,
          item.assetTag ?? "",
          item.storageLocation,
          item.condition,
        ].some((value) => value.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (category === "All categories" || item.category === category)
      );
    });
  }, [category, items, search]);

  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
  const spareStock = items.reduce((sum, item) => sum + item.spareQuantity, 0);
  const taggedItems = items.filter((item) => item.assetTag).length;
  const pendingReplacements = requests.filter(
    (request) => request.type === "Replacement" && request.status === "Pending",
  ).length;
  const stockValue = items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0,
  );

  function openOperation(type: Operation, item: WardItem) {
    setOperation(type);
    setSelected(item);
    setWard(WARDS[0]);
    setQuantity("1");
    setReason("");
  }

  function closeOperation() {
    setOperation(null);
    setSelected(null);
  }

  function submitOperation() {
    if (!selected || !operation) return;
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount <= 0) {
      toast.error("Enter a valid whole-number quantity.");
      return;
    }
    if (amount > selected.quantity) {
      toast.error("Requested quantity exceeds available stock.");
      return;
    }
    if (operation !== "Distribution" && !reason.trim()) {
      toast.error("A reason is required for this request.");
      return;
    }

    if (operation === "Distribution") {
      setItems((current) =>
        current.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                quantity: item.quantity - amount,
                spareQuantity: Math.min(
                  item.spareQuantity,
                  item.quantity - amount,
                ),
              }
            : item,
        ),
      );
    }

    setRequests((current) => [
      {
        id: `${Date.now()}`,
        type: operation,
        itemName: selected.itemName,
        ward,
        quantity: amount,
        reason:
          reason.trim() ||
          `Stock distributed from ${selected.storageLocation}`,
        status: operation === "Distribution" ? "Completed" : "Pending",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    toast.success(
      operation === "Distribution"
        ? `${amount} ${selected.unit} distributed to ${ward}.`
        : `${operation} request submitted.`,
    );
    closeOperation();
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Inventory / Departments
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          Hospital Ward Items
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage ward assets from procurement and storage through distribution,
          replacement, and disposal.
        </p>
      </header>

      <section
        aria-label="Ward inventory summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {[
          { label: "Available stock", value: totalStock, icon: Boxes },
          { label: "Spare inventory", value: spareStock, icon: Archive },
          { label: "Tagged item types", value: taggedItems, icon: QrCode },
          {
            label: "Replacement requests",
            value: pendingReplacements,
            icon: RefreshCcw,
          },
          {
            label: "Stock value",
            value: formatCurrency(stockValue),
            icon: ShoppingCart,
          },
        ].map((metric) => (
          <article key={metric.label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <metric.icon size={18} className="text-primary" />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">
              {metric.value}
            </p>
          </article>
        ))}
      </section>

      <section className="surface-card p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Inventory Lifecycle</h2>
          <p className="text-xs text-muted-foreground">
            Operational coverage for every ward-item stage.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {[
            ["Procurement", ShoppingCart],
            ["Stock Records", ClipboardList],
            ["New Storage", Warehouse],
            ["Ward Distribution", Send],
            ["Spare Inventory", Archive],
            ["Replacement", RefreshCcw],
            ["Asset Tagging", QrCode],
            ["Disposal", Trash2],
          ].map(([label, Icon]) => {
            const LifecycleIcon = Icon as typeof ShoppingCart;
            return (
              <div
                key={label as string}
                className="rounded-lg border border-border bg-background p-3"
              >
                <LifecycleIcon size={18} className="text-primary" />
                <p className="mt-2 text-xs font-semibold">{label as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold">Stock Records</h2>
            <p className="text-xs text-muted-foreground">
              New storage, spare levels, tagging, condition, and procurement
              details.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(240px,1fr)_180px]">
            <label className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <span className="sr-only">Search ward items</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search items, tags, location..."
                className="h-10 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <FieldSelect
              size="small"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              options={[
                { value: "All categories", label: "All categories" },
                { value: "Bed", label: "Beds" },
                { value: "Equipment", label: "Equipment" },
                { value: "Furniture", label: "Furniture" },
                { value: "Patient Care", label: "Patient Care" },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Item",
                  "Asset Tag",
                  "Available",
                  "Spare",
                  "Storage",
                  "Condition",
                  "Last Procured",
                  "Unit Cost",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{item.itemName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {item.assetTag ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs">
                        <QrCode size={14} />
                        {item.assetTag}
                      </span>
                    ) : (
                      <span className="font-medium text-warning">
                        Tag required
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-4">
                    {item.spareQuantity} {item.unit}
                  </td>
                  <td className="px-4 py-4">{item.storageLocation}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${conditionClass(item.condition)}`}
                    >
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(`${item.lastProcured}T00:00:00`).toLocaleDateString(
                      "en-IN",
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {formatCurrency(item.unitCost)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-72 flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => openOperation("Distribution", item)}
                      >
                        <Send size={14} />
                        Distribute
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openOperation("Replacement", item)}
                      >
                        <RefreshCcw size={14} />
                        Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openOperation("Disposal", item)}
                      >
                        <Trash2 size={14} />
                        Dispose
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="surface-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <PackageCheck size={18} className="text-primary" />
            <div>
              <h2 className="text-base font-semibold">Recent Procurement</h2>
              <p className="text-xs text-muted-foreground">
                Latest received beds and equipment.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[...items]
              .sort(
                (a, b) =>
                  new Date(b.lastProcured).getTime() -
                  new Date(a.lastProcured).getTime(),
              )
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.itemName}</p>
                    <p className="text-xs text-muted-foreground">
                      Stored at {item.storageLocation}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-success">
                    Received
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-semibold">Requests & Distribution</h2>
            <p className="text-xs text-muted-foreground">
              Ward issues, replacements, and disposal approvals.
            </p>
          </div>
          {requests.length === 0 ? (
            <div className="p-8 text-center">
              <BedDouble
                size={28}
                className="mx-auto text-muted-foreground"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                No requests recorded in this session.
              </p>
            </div>
          ) : (
            <div className="max-h-80 divide-y divide-border overflow-y-auto">
              {requests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {request.type} · {request.itemName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.quantity} item(s) · {request.ward}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.reason}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        request.status === "Completed"
                          ? "bg-success-muted text-success"
                          : "bg-warning-muted text-warning"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Modal
        open={Boolean(operation && selected)}
        onClose={closeOperation}
        title={`${operation ?? ""} request`}
        actions={
          <>
            <Button variant="ghost" onClick={closeOperation}>
              Cancel
            </Button>
            <Button onClick={submitOperation}>
              {operation === "Distribution"
                ? "Confirm distribution"
                : "Submit request"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-semibold">{selected?.itemName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Available: {selected?.quantity} {selected?.unit}
            </p>
          </div>
          <FieldSelect
            label="Ward"
            value={ward}
            onChange={(event) => setWard(event.target.value)}
            options={WARDS.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <FieldText
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            inputProps={{ min: 1, step: 1 }}
            fullWidth
            required
          />
          {operation !== "Distribution" && (
            <FieldText
              label="Reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              multiline
              minRows={3}
              fullWidth
              required
              helperText="Required for approval and audit."
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
