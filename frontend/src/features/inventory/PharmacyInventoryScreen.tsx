"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Package,
  RotateCcw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
import {
  INITIAL_PHARMACY_STOCK,
  daysUntilExpiry,
  sortByFefo,
  type PharmacyStock,
  type StockAudit,
} from "./pharmacy-data";

type Operation = "dispense" | "return" | "correction";

const destinationOptions = [
  { value: "Main Store", label: "Main Store / Patient Dispense" },
  { value: "Ward", label: "Ward Stock Issue" },
  { value: "Emergency", label: "Emergency Stock Issue" },
];

function expiryState(item: PharmacyStock) {
  const days = daysUntilExpiry(item.expiryDate);
  if (days < 0) {
    return {
      label: "Expired",
      className: "bg-danger-muted text-danger",
    };
  }
  if (days <= 90) {
    return {
      label: `${days} days left`,
      className: "bg-warning-muted text-warning",
    };
  }
  return {
    label: "Valid",
    className: "bg-success-muted text-success",
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function PharmacyInventoryScreen() {
  const [stock, setStock] = useState(INITIAL_PHARMACY_STOCK);
  const [auditLog, setAuditLog] = useState<StockAudit[]>([]);
  const [search, setSearch] = useState("");
  const [operation, setOperation] = useState<Operation | null>(null);
  const [selected, setSelected] = useState<PharmacyStock | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState<
    "Main Store" | "Ward" | "Emergency"
  >("Main Store");

  const fefoStock = useMemo(() => sortByFefo(stock), [stock]);
  const filteredStock = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return fefoStock;
    return fefoStock.filter((item) =>
      [
        item.medicineName,
        item.genericName,
        item.strength,
        item.form,
        item.batchNumber,
        item.manufacturer,
        item.storeLocation,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [fefoStock, search]);

  const lowStock = stock.filter((item) => item.quantity <= item.reorderLevel);
  const nearExpiry = stock.filter((item) => {
    const days = daysUntilExpiry(item.expiryDate);
    return days >= 0 && days <= 90;
  });
  const stockValue = stock.reduce(
    (total, item) => total + item.quantity * item.purchaseRate,
    0,
  );

  function isNextFefoBatch(item: PharmacyStock) {
    const eligible = fefoStock.find(
      (candidate) =>
        candidate.genericName === item.genericName &&
        candidate.quantity > 0 &&
        daysUntilExpiry(candidate.expiryDate) >= 0,
    );
    return eligible?.id === item.id;
  }

  function openOperation(nextOperation: Operation, item: PharmacyStock) {
    setOperation(nextOperation);
    setSelected(item);
    setQuantity("1");
    setReason("");
    setDestination("Main Store");
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
    if ((operation === "return" || operation === "correction") && !reason.trim()) {
      toast.error("A reason is required for this operation.");
      return;
    }
    if (operation === "dispense") {
      if (daysUntilExpiry(selected.expiryDate) < 0) {
        toast.error("Expired medicines cannot be dispensed.");
        return;
      }
      if (!isNextFefoBatch(selected)) {
        toast.warning("FEFO requires dispensing the earliest valid batch first.");
        return;
      }
      if (amount > selected.quantity) {
        toast.error("Dispense quantity exceeds available stock.");
        return;
      }
    }

    const quantityChange = operation === "dispense" ? -amount : amount;
    setStock((current) =>
      current.map((item) =>
        item.id === selected.id
          ? { ...item, quantity: Math.max(0, item.quantity + quantityChange) }
          : item,
      ),
    );

    const action =
      operation === "dispense"
        ? "Dispense"
        : operation === "return"
          ? "Return"
          : "Correction";
    setAuditLog((current) => [
      {
        id: `${Date.now()}`,
        batchNumber: selected.batchNumber,
        medicineName: selected.medicineName,
        action,
        quantityChange,
        reason:
          reason.trim() ||
          `${destination} issue${amount < selected.quantity ? " (partial)" : ""}`,
        destination: operation === "dispense" ? destination : undefined,
        performedAt: new Date().toISOString(),
        performedBy: "Inventory Manager",
      },
      ...current,
    ]);

    if (operation === "correction") {
      toast.success("Stock adjustment completed. Inventory Manager notified.");
    } else {
      toast.success(`${action} recorded successfully.`);
    }
    closeOperation();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Inventory / Departments
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Pharmacy Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Batch-level medicine tracking with FEFO and controlled stock movement.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success-muted px-3 py-2 text-sm font-medium text-success">
          <CheckCircle2 size={16} />
          FEFO enforcement active
        </div>
      </header>

      <section
        aria-label="Pharmacy inventory summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Medicine batches",
            value: stock.length,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Low stock",
            value: lowStock.length,
            icon: AlertTriangle,
            color: "text-danger",
          },
          {
            label: "Near expiry",
            value: nearExpiry.length,
            icon: Bell,
            color: "text-warning",
          },
          {
            label: "Stock value",
            value: formatCurrency(stockValue),
            icon: ClipboardCheck,
            color: "text-success",
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
        <div className="mb-4 flex items-center gap-2">
          <Bell size={18} className="text-primary" />
          <div>
            <h2 className="text-base font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">
              Automatically routed according to pharmacy inventory rules.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-danger/25 bg-danger-muted p-4">
            <p className="font-semibold text-danger">Low Stock</p>
            <p className="mt-1 text-sm text-danger">
              {lowStock.length} batch{lowStock.length === 1 ? "" : "es"} below
              reorder level
            </p>
            <p className="mt-2 text-xs text-danger">To: Inventory Manager</p>
          </div>
          <div className="rounded-lg border border-warning/25 bg-warning-muted p-4">
            <p className="font-semibold text-warning">Near Expiry Medicines</p>
            <p className="mt-1 text-sm text-warning">
              {nearExpiry.length} batch{nearExpiry.length === 1 ? "" : "es"} expire
              within 90 days
            </p>
            <p className="mt-2 text-xs text-warning">To: Inventory Team</p>
          </div>
          <div className="rounded-lg border border-success/25 bg-success-muted p-4">
            <p className="font-semibold text-success">
              Stock Adjustment Completed
            </p>
            <p className="mt-1 text-sm text-success">
              {auditLog.filter((entry) => entry.action === "Correction").length}{" "}
              adjustment notification(s)
            </p>
            <p className="mt-2 text-xs text-success">To: Inventory Manager</p>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold">Medicine & Batch Stock</h2>
            <p className="text-xs text-muted-foreground">
              Sorted by earliest expiry first. Expired batches are blocked.
            </p>
          </div>
          <label className="relative block w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <span className="sr-only">Search medicines</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search medicine, generic, batch..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1450px] w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Medicine",
                  "Strength / Form",
                  "Batch",
                  "Expiry",
                  "Quantity",
                  "Manufacturer",
                  "Rates",
                  "Store",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStock.map((item) => {
                const expiry = expiryState(item);
                const isExpired = daysUntilExpiry(item.expiryDate) < 0;
                const fefoReady = isNextFefoBatch(item);
                return (
                  <tr key={item.id} className="align-top hover:bg-muted/50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">
                        {item.medicineName}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.genericName}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p>{item.strength}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.form}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">
                      {item.batchNumber}
                    </td>
                    <td className="px-4 py-4">
                      <p>{new Date(item.expiryDate).toLocaleDateString("en-IN")}</p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${expiry.className}`}
                      >
                        {expiry.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p
                        className={
                          item.quantity <= item.reorderLevel
                            ? "font-bold text-danger"
                            : "font-semibold"
                        }
                      >
                        {item.quantity} {item.unit}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Reorder at {item.reorderLevel}
                      </p>
                    </td>
                    <td className="px-4 py-4">{item.manufacturer}</td>
                    <td className="px-4 py-4">
                      <p>Purchase: {formatCurrency(item.purchaseRate)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Issue/MRP: {formatCurrency(item.issueRate)}
                      </p>
                    </td>
                    <td className="px-4 py-4">{item.storeLocation}</td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-64 flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={isExpired || !fefoReady || item.quantity === 0}
                          onClick={() => openOperation("dispense", item)}
                          title={
                            isExpired
                              ? "Expired medicines are blocked"
                              : !fefoReady
                                ? "Dispense the earlier-expiry batch first"
                                : "Partial dispensing is allowed"
                          }
                        >
                          <ArrowDownToLine size={14} />
                          Issue
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openOperation("return", item)}
                        >
                          <RotateCcw size={14} />
                          Return
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openOperation("correction", item)}
                        >
                          <ShieldAlert size={14} />
                          Correct
                        </Button>
                      </div>
                      {!isExpired && !fefoReady && (
                        <p className="mt-2 text-xs text-warning">
                          Waiting for earlier FEFO batch
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-base font-semibold">Stock Movement Audit</h2>
          <p className="text-xs text-muted-foreground">
            Corrections, returns, and issues are recorded with operator and reason.
          </p>
        </div>
        {auditLog.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No stock movements recorded in this session.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-muted text-left text-xs text-muted-foreground">
                <tr>
                  {[
                    "Time",
                    "Medicine / Batch",
                    "Action",
                    "Change",
                    "Destination",
                    "Reason",
                    "Operator",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLog.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3">
                      {new Date(entry.performedAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{entry.medicineName}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {entry.batchNumber}
                      </p>
                    </td>
                    <td className="px-4 py-3">{entry.action}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        entry.quantityChange >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {entry.quantityChange > 0 ? "+" : ""}
                      {entry.quantityChange}
                    </td>
                    <td className="px-4 py-3">{entry.destination ?? "—"}</td>
                    <td className="px-4 py-3">{entry.reason}</td>
                    <td className="px-4 py-3">{entry.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={Boolean(operation && selected)}
        onClose={closeOperation}
        title={
          operation === "dispense"
            ? "Issue medicine"
            : operation === "return"
              ? "Return medicine"
              : "Correct stock"
        }
        actions={
          <>
            <Button variant="ghost" onClick={closeOperation}>
              Cancel
            </Button>
            <Button onClick={submitOperation}>
              {operation === "dispense"
                ? "Confirm issue"
                : operation === "return"
                  ? "Record return"
                  : "Complete adjustment"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 pt-2">
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-semibold">{selected?.medicineName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Batch {selected?.batchNumber} · Available {selected?.quantity}{" "}
              {selected?.unit}
            </p>
          </div>
          <FieldText
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            inputProps={{ min: 1, step: 1 }}
            fullWidth
            required
            helperText={
              operation === "dispense"
                ? "Partial quantities are allowed."
                : undefined
            }
          />
          {operation === "dispense" && (
            <FieldSelect
              label="Issue destination"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value as "Main Store" | "Ward" | "Emergency",
                )
              }
              options={destinationOptions}
              fullWidth
            />
          )}
          {(operation === "return" || operation === "correction") && (
            <FieldText
              label="Reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              multiline
              minRows={3}
              fullWidth
              required
              helperText="Required for audit traceability."
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
