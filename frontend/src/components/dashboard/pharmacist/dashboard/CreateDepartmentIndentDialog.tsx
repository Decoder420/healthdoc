"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  inventoryItems,
} from "@/features/inventory/data/indentData";

interface DepartmentIndentItem {
  id: string;
  itemId: string;
  itemName: string;
  availableStock: number;
  quantity: number;
}

interface Props {
  open: boolean;
  onClose: () => void;

  requestedBy: string;

  departmentId: string;
  departmentName: string;

  onSave?: (data: {
    indent: Record<string, unknown>;
    indentItems: DepartmentIndentItem[];
  }) => void;
}

const PRIORITIES = [
  "Normal",
  "Urgent",
  "Emergency",
] as const;

export default function CreateDepartmentIndentDialog({
  open,
  onClose,
  requestedBy,
  departmentId,
  departmentName,
  onSave,
}: Props) {
  const [mounted, setMounted] =
    useState(false);

  const [priority, setPriority] =
    useState<
      (typeof PRIORITIES)[number]
    >("Normal");

  const [remarks, setRemarks] =
    useState("");

  const [items, setItems] =
    useState<DepartmentIndentItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    setPriority("Normal");
    setRemarks("");
    setItems([]);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [open, onClose]);

 const availableItems = useMemo(() => {
  if (!departmentId) {
    return [];
  }

  return inventoryItems.filter(
    (item) =>
      item.departmentId === departmentId,
  );
}, [departmentId]);

  const handleAddItem = () => {
    setItems((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        itemId: "",
        itemName: "",
        availableStock: 0,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItem = (
    id: string,
  ) => {
    setItems((previous) =>
      previous.filter(
        (item) => item.id !== id,
      ),
    );
  };

  const handleItemChange = (
  rowId: string,
  itemId: string,
) => {
  const selectedItem =
    availableItems.find(
      (item) =>
        item.id === itemId,
    );

  if (!selectedItem) return;

  // Extra protection
  if (
    selectedItem.departmentId !==
    departmentId
  ) {
    return;
  }

  setItems((previous) =>
    previous.map((row) =>
      row.id === rowId
        ? {
            ...row,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            availableStock:
              selectedItem.stock,
          }
        : row,
    ),
  );
};

  const handleQuantityChange = (
    rowId: string,
    quantity: number,
  ) => {
    setItems((previous) =>
      previous.map((row) =>
        row.id === rowId
          ? {
              ...row,
              quantity:
                Number.isFinite(
                  quantity,
                ) &&
                quantity > 0
                  ? Math.floor(
                      quantity,
                    )
                  : 1,
            }
          : row,
      ),
    );
  };

  const handleSubmit = () => {
    /*
     * Department is NOT taken from
     * the form.
     *
     * It comes from the authenticated user.
     */
    if (
      !departmentId ||
      !departmentName ||
      items.length === 0 ||
      items.some(
        (item) =>
          !item.itemId ||
          item.quantity <= 0,
      )
    ) {
      return;
    }

    const indent = {
      id: crypto.randomUUID(),

      requestNumber:
        `IND-${Date.now()}`,

      departmentId,

      departmentName,

      requestedBy,

      priority,

      status: "Pending",

      items: items.length,

      totalQuantity:
        items.reduce(
          (total, item) =>
            total + item.quantity,
          0,
        ),

      createdAt:
        new Date().toLocaleDateString(),

      remarks,

      source: departmentName,

      destination: "Inventory",
    };

    onSave?.({
      indent,
      indentItems: items,
    });

    onClose();
  };

  const canSubmit =
    Boolean(departmentId) &&
    Boolean(departmentName) &&
    items.length > 0 &&
    items.every(
      (item) =>
        Boolean(item.itemId) &&
        item.quantity > 0,
    );

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-[#001f54]/45 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b border-border bg-muted px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Create Indent Request
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Request medicines or inventory
              items from Central Inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="overflow-y-auto p-6">

          {/* Request Information */}

          <div className="grid gap-4 md:grid-cols-2">

            {/* Department */}

            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Requesting Department
              </span>

              <div className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-semibold text-foreground">
                {departmentName}
              </div>
            </div>

            {/* Requested By */}

            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Requested By
              </span>

              <div className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm font-semibold text-foreground">
                {requestedBy}
              </div>
            </div>

            {/* Priority */}

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Priority
              </span>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as
                      (typeof PRIORITIES)[number],
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {PRIORITIES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>

          {/* Requested Items */}

          <div className="mt-7 border-t border-border pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Requested Items
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select the items required by
                  {departmentName}.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-secondary"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {items.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted p-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No items added
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Click "Add Item" to add
                  medicines or inventory items.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map(
                  (row, index) => (
                    <div
                      key={row.id}
                      className="rounded-xl border border-border bg-muted/40 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold uppercase text-muted-foreground">
                          Item {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              row.id,
                            )
                          }
                          className="btn btn-outline btn-icon text-danger"
                          aria-label="Remove item"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">

                        {/* Item */}

                        <label>
                          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            Medicine / Item
                          </span>

                          <select
                            value={
                              row.itemId
                            }
                            onChange={(
                              event,
                            ) =>
                              handleItemChange(
                                row.id,
                                event.target
                                  .value,
                              )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                          >
                            <option value="">
                              Select item
                            </option>

                            {availableItems.map(
                              (item) => (
                                <option
                                  key={
                                    item.id
                                  }
                                  value={
                                    item.id
                                  }
                                >
                                  {
                                    item.name
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </label>

                        {/* Stock */}

                        <label>
                          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            Available Stock
                          </span>

                          <input
                            value={
                              row.availableStock
                            }
                            disabled
                            className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-foreground"
                          />
                        </label>

                        {/* Quantity */}

                        <label>
                          <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            Required Quantity
                          </span>

                          <input
                            type="number"
                            min={1}
                            value={
                              row.quantity
                            }
                            onChange={(
                              event,
                            ) =>
                              handleQuantityChange(
                                row.id,
                                Number(
                                  event.target
                                    .value,
                                ),
                              )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                          />
                        </label>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Remarks */}

          <label className="mt-6 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Remarks
            </span>

            <textarea
              rows={3}
              value={remarks}
              onChange={(event) =>
                setRemarks(
                  event.target.value,
                )
              }
              placeholder="Add any additional information..."
              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-border bg-muted px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn btn-primary"
          >
            Submit Indent Request
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}