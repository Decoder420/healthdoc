"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, X } from "lucide-react";

import { inventoryItems } from "@/features/inventory/data/indentData";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: (data: {
    indent: Record<string, unknown>;
    indentItems: IndentItem[];
  }) => void;
}

interface IndentItem {
  id: string;
  itemId: string;
  itemName: string;
  availableStock: number;
  quantity: number;
}

const DEPARTMENTS = [
  "Radiology",
  "Laboratory",
  "Operation Theatre",
  "Emergency",
  "Pharmacy",
] as const;

const PRIORITIES = ["Normal", "Urgent", "Emergency"] as const;

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1400,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  backgroundColor: "rgba(0, 31, 84, 0.45)",
};

const panelStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "48rem",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: "1rem",
  border: "1px solid #d6dee8",
  backgroundColor: "#ffffff",
  color: "#001f54",
  boxShadow: "0 24px 48px rgba(0, 31, 84, 0.2)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "1.25rem 1.5rem",
  borderBottom: "1px solid #d6dee8",
  backgroundColor: "#f4f6f9",
};

const bodyStyle: React.CSSProperties = {
  padding: "1.5rem",
  overflowY: "auto",
  backgroundColor: "#ffffff",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.75rem",
  padding: "1rem 1.5rem",
  borderTop: "1px solid #d6dee8",
  backgroundColor: "#f4f6f9",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.375rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#4a6282",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "2.75rem",
  padding: "0.625rem 0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #d6dee8",
  backgroundColor: "#ffffff",
  color: "#001f54",
  fontSize: "0.875rem",
  outline: "none",
};

const primaryBtnStyle: React.CSSProperties = {
  minHeight: "2.5rem",
  padding: "0.625rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid #001f54",
  backgroundColor: "#001f54",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "0.875rem",
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  minHeight: "2.5rem",
  padding: "0.625rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid #d6dee8",
  backgroundColor: "#ffffff",
  color: "#001f54",
  fontWeight: 600,
  fontSize: "0.875rem",
  cursor: "pointer",
};

export default function CreateIndentDialog({
  open,
  onClose,
  onSave,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState<IndentItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filteredItems = useMemo(
    () => inventoryItems.filter((item) => item.department === department),
    [department],
  );

  const resetForm = () => {
    setDepartment("");
    setPriority("Normal");
    setRemarks("");
    setItems([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddItem = () => {
    if (!department) return;
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemId: "",
        itemName: "",
        availableStock: 0,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((row) => row.id !== id));
  };

  const handleItemChange = (rowId: string, selectedItemId: string) => {
    const selected = inventoryItems.find((item) => item.id === selectedItemId);
    if (!selected) return;
    setItems((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              itemId: selected.id,
              itemName: selected.name,
              availableStock: selected.stock,
            }
          : row,
      ),
    );
  };

  const handleQuantityChange = (rowId: string, qty: number) => {
    setItems((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, quantity: Number.isFinite(qty) ? Math.max(1, qty) : 1 }
          : row,
      ),
    );
  };

  const handleSubmit = () => {
    const indent = {
      id: crypto.randomUUID(),
      requestNumber: `IND-${Date.now()}`,
      departmentId: department,
      departmentName: department,
      requestedBy: "Inventory Manager",
      priority,
      status: "Pending",
      items: items.length,
      totalQuantity: items.reduce((sum, row) => sum + row.quantity, 0),
      createdAt: new Date().toLocaleDateString(),
      remarks,
    };

    onSave?.({ indent, indentItems: items });
    resetForm();
    onClose();
  };

  const canSubmit =
    Boolean(department) &&
    items.length > 0 &&
    items.every((row) => row.itemId && row.quantity > 0);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      style={overlayStyle}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-indent-title"
        style={panelStyle}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div style={headerStyle}>
          <div>
            <h2
              id="create-indent-title"
              style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}
            >
              Create Department Indent
            </h2>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "0.8125rem",
                color: "#4a6282",
              }}
            >
              Request stock for a department from central inventory
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            style={{
              ...secondaryBtnStyle,
              width: 40,
              minHeight: 40,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={bodyStyle}>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Department</span>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setItems([]);
                }}
                style={inputStyle}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: "block" }}>
              <span style={labelStyle}>Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={inputStyle}
              >
                {PRIORITIES.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: "block", marginTop: "1rem" }}>
            <span style={labelStyle}>Requested By</span>
            <input
              value="Inventory Manager"
              disabled
              style={{ ...inputStyle, backgroundColor: "#f4f6f9" }}
            />
          </label>

          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #d6dee8",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                Requested Items
              </h3>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.8125rem",
                  color: "#4a6282",
                }}
              >
                {department
                  ? `${filteredItems.length} items available for ${department}`
                  : "Select a department first"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!department}
              style={{
                ...secondaryBtnStyle,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                opacity: department ? 1 : 0.5,
                cursor: department ? "pointer" : "not-allowed",
              }}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div
              style={{
                marginTop: "1rem",
                border: "1px dashed #d6dee8",
                borderRadius: "0.75rem",
                backgroundColor: "#f4f6f9",
                padding: "2.5rem 1rem",
                textAlign: "center",
                color: "#4a6282",
                fontSize: "0.875rem",
              }}
            >
              Click &quot;Add Item&quot; to add medicines or consumables.
            </div>
          ) : (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {items.map((row, index) => (
                <div
                  key={row.id}
                  style={{
                    border: "1px solid #d6dee8",
                    borderRadius: "0.75rem",
                    backgroundColor: "#fafbfd",
                    padding: "1rem",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.75rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "#4a6282",
                    }}
                  >
                    Item {index + 1}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gap: "0.75rem",
                      gridTemplateColumns:
                        "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto",
                    }}
                  >
                    <label style={{ display: "block" }}>
                      <span style={labelStyle}>Item</span>
                      <select
                        value={row.itemId}
                        onChange={(e) =>
                          handleItemChange(row.id, e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="">Select item</option>
                        {filteredItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: "block" }}>
                      <span style={labelStyle}>Available Stock</span>
                      <input
                        value={row.availableStock}
                        disabled
                        style={{ ...inputStyle, backgroundColor: "#f4f6f9" }}
                      />
                    </label>

                    <label style={{ display: "block" }}>
                      <span style={labelStyle}>Quantity</span>
                      <input
                        type="number"
                        min={1}
                        value={row.quantity}
                        onChange={(e) =>
                          handleQuantityChange(row.id, Number(e.target.value))
                        }
                        style={inputStyle}
                      />
                    </label>

                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => handleRemoveItem(row.id)}
                      style={{
                        alignSelf: "end",
                        width: 44,
                        height: 44,
                        borderRadius: "0.5rem",
                        border: "1px solid #fecaca",
                        backgroundColor: "#ffffff",
                        color: "#b91c1c",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label style={{ display: "block", marginTop: "1.25rem" }}>
            <span style={labelStyle}>Remarks</span>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                minHeight: "5rem",
                resize: "vertical",
              }}
            />
          </label>
        </div>

        <div style={footerStyle}>
          <button type="button" onClick={handleClose} style={secondaryBtnStyle}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              ...primaryBtnStyle,
              opacity: canSubmit ? 1 : 0.45,
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            Submit Indent
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
