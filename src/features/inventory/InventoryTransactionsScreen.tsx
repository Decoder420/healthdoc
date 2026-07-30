"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  ClipboardList,
  FileCheck2,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  ShoppingCart,
  Trash2,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
<<<<<<< Updated upstream
import {
  INITIAL_TRANSACTIONS,
  TRANSACTION_TYPES,
  TYPE_PREFIX,
  type InventoryTransaction,
  type TransactionStatus,
  type TransactionType,
} from "@/features/inventory/transactions-data";
=======
import Breadcrumbs from "@/components/shared/Breadcrumbs";

type TransactionType =
  | "Purchase Request"
  | "Purchase Order"
  | "GRN"
  | "Stock Issue"
  | "Stock Return"
  | "Stock Transfer"
  | "Consumption"
  | "Adjustment"
  | "Damage/Expiry Write-off";

type TransactionStatus = "Draft" | "Pending" | "Approved" | "Completed";

type InventoryTransaction = {
  id: string;
  number: string;
  type: TransactionType;
  date: string;
  itemName: string;
  quantity: number;
  unit: string;
  source: string;
  destination: string;
  reference: string;
  status: TransactionStatus;
  createdBy: string;
  notes: string;
};

const TRANSACTION_TYPES: TransactionType[] = [
  "Purchase Request",
  "Purchase Order",
  "GRN",
  "Stock Issue",
  "Stock Return",
  "Stock Transfer",
  "Consumption",
  "Adjustment",
  "Damage/Expiry Write-off",
];

const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: "tx-1",
    number: "GRN-2026-00782",
    type: "GRN",
    date: "2026-07-18T08:40:00.000Z",
    itemName: "Normal Saline 500 ml",
    quantity: 240,
    unit: "bottles",
    source: "Baxter India",
    destination: "Central Warehouse",
    reference: "PO-2026-00491",
    status: "Completed",
    createdBy: "Inventory Manager",
    notes: "Received and quality checked.",
  },
  {
    id: "tx-2",
    number: "ISS-2026-01144",
    type: "Stock Issue",
    date: "2026-07-18T07:15:00.000Z",
    itemName: "Surgical Gloves 7.5",
    quantity: 80,
    unit: "pairs",
    source: "Central Warehouse",
    destination: "Operation Theatre",
    reference: "REQ-OT-00512",
    status: "Completed",
    createdBy: "Store Officer",
    notes: "Routine OT stock replenishment.",
  },
  {
    id: "tx-3",
    number: "TRF-2026-00308",
    type: "Stock Transfer",
    date: "2026-07-17T13:30:00.000Z",
    itemName: "Oxygen Mask Adult",
    quantity: 25,
    unit: "pieces",
    source: "Central Warehouse",
    destination: "Emergency Store",
    reference: "EMG-REQ-00192",
    status: "Completed",
    createdBy: "Inventory Manager",
    notes: "Emergency buffer stock.",
  },
  {
    id: "tx-4",
    number: "RET-2026-00126",
    type: "Stock Return",
    date: "2026-07-17T10:20:00.000Z",
    itemName: "IV Cannula 20G",
    quantity: 12,
    unit: "pieces",
    source: "General Ward",
    destination: "Central Warehouse",
    reference: "ISS-2026-01082",
    status: "Completed",
    createdBy: "Ward In-charge",
    notes: "Unused sealed stock.",
  },
  {
    id: "tx-5",
    number: "WO-2026-00048",
    type: "Damage/Expiry Write-off",
    date: "2026-07-16T09:05:00.000Z",
    itemName: "Insulin Human 100 IU/ml",
    quantity: 3,
    unit: "vials",
    source: "Pharmacy Cold Store",
    destination: "Quarantine / Disposal",
    reference: "EXP-AUDIT-0716",
    status: "Approved",
    createdBy: "Pharmacy Manager",
    notes: "Expired units quarantined for disposal.",
  },
  {
    id: "tx-6",
    number: "PR-2026-00619",
    type: "Purchase Request",
    date: "2026-07-15T12:10:00.000Z",
    itemName: "Motorized ICU Bed",
    quantity: 6,
    unit: "beds",
    source: "ICU",
    destination: "Procurement",
    reference: "CAPEX-ICU-2026",
    status: "Pending",
    createdBy: "ICU In-charge",
    notes: "Capacity expansion requirement.",
  },
];

const TYPE_PREFIX: Record<TransactionType, string> = {
  "Purchase Request": "PR",
  "Purchase Order": "PO",
  GRN: "GRN",
  "Stock Issue": "ISS",
  "Stock Return": "RET",
  "Stock Transfer": "TRF",
  Consumption: "CON",
  Adjustment: "ADJ",
  "Damage/Expiry Write-off": "WO",
};
>>>>>>> Stashed changes

const typeIcons = {
  "Purchase Request": ClipboardList,
  "Purchase Order": ShoppingCart,
  GRN: PackageCheck,
  "Stock Issue": ArrowUpFromLine,
  "Stock Return": RefreshCcw,
  "Stock Transfer": ArrowLeftRight,
  Consumption: Utensils,
  Adjustment: Settings2,
  "Damage/Expiry Write-off": Trash2,
} satisfies Record<TransactionType, typeof ClipboardList>;

function statusClass(status: TransactionStatus) {
  if (status === "Completed" || status === "Approved") {
    return "bg-success-muted text-success";
  }
  if (status === "Pending") {
    return "bg-warning-muted text-warning";
  }
  return "bg-muted text-muted-foreground";
}

export function InventoryTransactionsScreen() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All transactions");
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("Purchase Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pieces");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [
          transaction.number,
          transaction.type,
          transaction.itemName,
          transaction.source,
          transaction.destination,
          transaction.reference,
          transaction.createdBy,
        ].some((value) => value.toLowerCase().includes(query));
      return (
        matchesSearch &&
        (typeFilter === "All transactions" ||
          transaction.type === typeFilter)
      );
    });
  }, [search, transactions, typeFilter]);

  const inboundCount = transactions.filter((transaction) =>
    ["GRN", "Stock Return"].includes(transaction.type),
  ).length;
  const outboundCount = transactions.filter((transaction) =>
    [
      "Stock Issue",
      "Consumption",
      "Damage/Expiry Write-off",
    ].includes(transaction.type),
  ).length;
  const pendingCount = transactions.filter(
    (transaction) => transaction.status === "Pending",
  ).length;

  function openCreateModal(nextType: TransactionType) {
    setType(nextType);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setItemName("");
    setQuantity("1");
    setUnit("pieces");
    setSource("");
    setDestination("");
    setReference("");
    setNotes("");
  }

  function createTransaction() {
    const amount = Number(quantity);
    if (
      !itemName.trim() ||
      !source.trim() ||
      !destination.trim() ||
      !reference.trim()
    ) {
      toast.error("Item, source, destination, and reference are required.");
      return;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      toast.error("Enter a valid whole-number quantity.");
      return;
    }
    if (
      (type === "Adjustment" || type === "Damage/Expiry Write-off") &&
      !notes.trim()
    ) {
      toast.error("A reason is mandatory for adjustments and write-offs.");
      return;
    }

    const prefix = TYPE_PREFIX[type];
    const number = `${prefix}-2026-${String(
      transactions.filter((transaction) => transaction.type === type).length +
        1,
    ).padStart(5, "0")}`;
    const status: TransactionStatus =
      type === "GRN" ||
      type === "Stock Issue" ||
      type === "Stock Return" ||
      type === "Stock Transfer" ||
      type === "Consumption"
        ? "Completed"
        : "Pending";

    setTransactions((current) => [
      {
        id: `${Date.now()}`,
        number,
        type,
        date: new Date().toISOString(),
        itemName: itemName.trim(),
        quantity: amount,
        unit: unit.trim(),
        source: source.trim(),
        destination: destination.trim(),
        reference: reference.trim(),
        status,
        createdBy: "Inventory Manager",
        notes: notes.trim() || "No additional notes.",
      },
      ...current,
    ]);
    toast.success(`${type} ${number} created.`);
    closeModal();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
         <Breadcrumbs
  items={[
    {
      label: "Inventory",
      href: "/inventory",
    },
   
    {
      label: "Inventory Transactions",
    },
  ]}
/>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            Inventory Transactions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Unified procurement, movement, consumption, and stock-adjustment
            ledger.
          </p>
        </div>
        <Button onClick={() => openCreateModal("Stock Issue")}>
          <Plus size={16} />
          New transaction
        </Button>
      </header>

      <section
        aria-label="Inventory transaction summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "All transactions",
            value: transactions.length,
            icon: FileCheck2,
          },
          {
            label: "Inbound",
            value: inboundCount,
            icon: ArrowDownToLine,
          },
          {
            label: "Outbound",
            value: outboundCount,
            icon: ArrowUpFromLine,
          },
          {
            label: "Pending approval",
            value: pendingCount,
            icon: ClipboardList,
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
          <h2 className="text-base font-semibold">Transaction Types</h2>
          <p className="text-xs text-muted-foreground">
            Select a workflow to create a controlled inventory record.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-9">
          {TRANSACTION_TYPES.map((transactionType) => {
            const Icon = typeIcons[transactionType];
            return (
              <button
                key={transactionType}
                type="button"
                onClick={() => openCreateModal(transactionType)}
                className="rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary hover:bg-muted"
              >
                <Icon size={18} className="text-primary" />
                <p className="mt-2 text-xs font-semibold">{transactionType}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
          {[
            ["Purchase Request", "Requirement raised"],
            ["Purchase Order", "Vendor commitment"],
            ["GRN", "Goods received"],
          ].map(([label, description], index) => (
            <div key={label} className="contents">
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
              {index < 2 && (
                <span className="text-muted-foreground" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold">Transaction Ledger</h2>
            <p className="text-xs text-muted-foreground">
              Auditable source, destination, reference, status, and operator
              history.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(260px,1fr)_220px]">
            <label className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <span className="sr-only">Search transactions</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search number, item, reference..."
                className="h-10 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <FieldSelect
              size="small"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              options={[
                {
                  value: "All transactions",
                  label: "All transactions",
                },
                ...TRANSACTION_TYPES.map((transactionType) => ({
                  value: transactionType,
                  label: transactionType,
                })),
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "Transaction",
                  "Date",
                  "Item",
                  "Quantity",
                  "Source",
                  "Destination",
                  "Reference",
                  "Status",
                  "Created By",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4">
                    <p className="font-mono text-xs font-semibold">
                      {transaction.number}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {transaction.type}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(transaction.date).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 font-medium">
                    {transaction.itemName}
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    {transaction.quantity} {transaction.unit}
                  </td>
                  <td className="px-4 py-4">{transaction.source}</td>
                  <td className="px-4 py-4">{transaction.destination}</td>
                  <td className="px-4 py-4 font-mono text-xs">
                    {transaction.reference}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{transaction.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={`Create ${type}`}
        maxWidth="md"
        actions={
          <>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={createTransaction}>Create transaction</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          <FieldSelect
            label="Transaction type"
            value={type}
            onChange={(event) => setType(event.target.value as TransactionType)}
            options={TRANSACTION_TYPES.map((transactionType) => ({
              value: transactionType,
              label: transactionType,
            }))}
            fullWidth
          />
          <FieldText
            label="Item name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            fullWidth
            required
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
          <FieldText
            label="Unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            fullWidth
            required
          />
          <FieldText
            label="Source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="Supplier, warehouse, or department"
            fullWidth
            required
          />
          <FieldText
            label="Destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Warehouse, department, or disposal"
            fullWidth
            required
          />
          <FieldText
            label="Reference number"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="PR, PO, issue request, or audit reference"
            fullWidth
            required
          />
          <FieldText
            label="Notes / reason"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            multiline
            minRows={3}
            fullWidth
            required={
              type === "Adjustment" || type === "Damage/Expiry Write-off"
            }
            helperText={
              type === "Adjustment" || type === "Damage/Expiry Write-off"
                ? "Mandatory for audit and approval."
                : "Optional transaction details."
            }
          />
        </div>
      </Modal>
    </div>
  );
}
