"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BedDouble,
  Boxes,
  Droplets,
  FlaskConical,
  Layers,
  MonitorSmartphone,
  PackageX,
  Pill,
  Plus,
  Scissors,
  Search,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldSelect, FieldText } from "@/components/ui/mui-field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/toast";
import {
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
  productStatus,
  type Product,
  type ProductStatus,
} from "./products-data";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Medicines: Pill,
  "IV Fluids": Droplets,
  "Medical Consumables": Layers,
  "Surgical Supplies": Scissors,
  "Medical Equipment": Stethoscope,
  "Laboratory Supplies": FlaskConical,
  "PPE & Infection Control": ShieldCheck,
  "Ward & Furniture": BedDouble,
  "IT & General": MonitorSmartphone,
};

const STATUS_OPTIONS = ["All statuses", "In Stock", "Low Stock", "Out of Stock"];

const EMPTY_FORM = {
  name: "",
  category: PRODUCT_CATEGORIES[0] as string,
  subCategory: "",
  manufacturer: "",
  unit: "",
  quantity: "",
  reorderLevel: "",
  purchaseRate: "",
  mrp: "",
  location: "",
};

function statusClass(status: ProductStatus) {
  if (status === "In Stock") return "bg-success-muted text-success";
  if (status === "Low Stock") return "bg-warning-muted text-warning";
  return "bg-danger-muted text-danger";
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

const SKU_PREFIXES: Record<string, string> = {
  Medicines: "MED",
  "IV Fluids": "IVF",
  "Medical Consumables": "CON",
  "Surgical Supplies": "SUR",
  "Medical Equipment": "EQP",
  "Laboratory Supplies": "LAB",
  "PPE & Infection Control": "PPE",
  "Ward & Furniture": "WRD",
  "IT & General": "ITG",
};

export function InventoryProductsScreen() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        [
          product.sku,
          product.name,
          product.category,
          product.subCategory,
          product.manufacturer,
          product.location,
        ].some((value) => value.toLowerCase().includes(query));
      const matchesCategory =
        categoryFilter === "All categories" ||
        product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All statuses" ||
        productStatus(product) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, products, search, statusFilter]);

  const lowStockCount = products.filter(
    (product) => productStatus(product) === "Low Stock",
  ).length;
  const outOfStockCount = products.filter(
    (product) => productStatus(product) === "Out of Stock",
  ).length;
  const stockValue = products.reduce(
    (total, product) => total + product.quantity * product.purchaseRate,
    0,
  );

  function updateForm<K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: string,
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function closeAddModal() {
    setIsAddOpen(false);
    setForm(EMPTY_FORM);
  }

  function addProduct() {
    const quantity = Number(form.quantity);
    const reorderLevel = Number(form.reorderLevel);
    const purchaseRate = Number(form.purchaseRate);
    const mrp = Number(form.mrp);

    if (!form.name.trim() || !form.unit.trim() || !form.location.trim()) {
      toast.error("Product name, unit, and store location are required.");
      return;
    }
    if (
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      !Number.isFinite(reorderLevel) ||
      reorderLevel < 0
    ) {
      toast.error("Quantity and reorder level must be valid numbers.");
      return;
    }
    if (!Number.isFinite(purchaseRate) || purchaseRate < 0 || !Number.isFinite(mrp) || mrp < 0) {
      toast.error("Purchase rate and MRP must be valid amounts.");
      return;
    }

    const prefix = SKU_PREFIXES[form.category] ?? "PRD";
    const nextNumber =
      products.filter((product) => product.category === form.category).length +
      1;
    const product: Product = {
      id: `prd-${Date.now()}`,
      sku: `${prefix}-${String(nextNumber).padStart(4, "0")}`,
      name: form.name.trim(),
      category: form.category,
      subCategory: form.subCategory.trim() || "General",
      manufacturer: form.manufacturer.trim() || "Unspecified",
      unit: form.unit.trim(),
      quantity,
      reorderLevel,
      purchaseRate,
      mrp,
      location: form.location.trim(),
    };

    setProducts((current) => [product, ...current]);
    toast.success(`${product.name} added to the product catalog.`);
    closeAddModal();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Inventory
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Central product master with categories, stock levels, pricing, and
            store locations.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus size={16} />
          Add product
        </Button>
      </header>

      <section
        aria-label="Product catalog summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            label: "Total products",
            value: products.length.toLocaleString("en-IN"),
            icon: Boxes,
            color: "text-primary",
          },
          {
            label: "Categories",
            value: PRODUCT_CATEGORIES.length.toLocaleString("en-IN"),
            icon: Layers,
            color: "text-primary",
          },
          {
            label: "Low stock products",
            value: lowStockCount.toLocaleString("en-IN"),
            icon: AlertTriangle,
            color: "text-warning",
          },
          {
            label: "Out of stock",
            value: outOfStockCount.toLocaleString("en-IN"),
            icon: PackageX,
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
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Product Categories</h2>
            <p className="text-xs text-muted-foreground">
              Select a category to filter the catalog below.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Stock value at purchase rate:{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(stockValue)}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {PRODUCT_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category] ?? Boxes;
            const count = products.filter(
              (product) => product.category === category,
            ).length;
            const isSelected = categoryFilter === category;
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
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <Icon size={17} />
                <p className="mt-2 text-xs font-semibold">{category}</p>
                <p
                  className={`mt-1 text-xs ${
                    isSelected
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground"
                  }`}
                >
                  {count} product{count === 1 ? "" : "s"}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold">Product Catalog</h2>
            <p className="text-xs text-muted-foreground">
              {filteredProducts.length} of {products.length} products shown.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(250px,1fr)_220px_170px]">
            <label className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <span className="sr-only">Search products</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, SKU, or manufacturer..."
                className="h-10 w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <FieldSelect
              size="small"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              options={[
                { value: "All categories", label: "All categories" },
                ...PRODUCT_CATEGORIES.map((category) => ({
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
          <table className="w-full min-w-[1250px] text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                {[
                  "SKU",
                  "Product",
                  "Category",
                  "Manufacturer",
                  "Stock",
                  "Reorder Level",
                  "Purchase Rate",
                  "MRP",
                  "Location",
                  "Status",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const status = productStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-muted/50">
                    <td className="px-4 py-4 font-mono text-xs font-semibold">
                      {product.sku}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.subCategory}
                      </p>
                    </td>
                    <td className="px-4 py-4">{product.category}</td>
                    <td className="px-4 py-4">{product.manufacturer}</td>
                    <td className="px-4 py-4">
                      <span className="font-semibold">
                        {product.quantity.toLocaleString("en-IN")}
                      </span>{" "}
                      <span className="text-xs text-muted-foreground">
                        {product.unit}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {product.reorderLevel.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      {formatCurrency(product.purchaseRate)}
                    </td>
                    <td className="px-4 py-4">{formatCurrency(product.mrp)}</td>
                    <td className="px-4 py-4">{product.location}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(status)}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No products match the selected filters.
          </p>
        )}
      </section>

      <Modal
        open={isAddOpen}
        onClose={closeAddModal}
        title="Add product to catalog"
        actions={
          <>
            <Button variant="ghost" onClick={closeAddModal}>
              Cancel
            </Button>
            <Button onClick={addProduct}>Add product</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
          <FieldText
            label="Product name"
            value={form.name}
            onChange={(event) => updateForm("name", event.target.value)}
            fullWidth
            required
          />
          <FieldSelect
            label="Category"
            value={form.category}
            onChange={(event) => updateForm("category", event.target.value)}
            options={PRODUCT_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            }))}
            fullWidth
          />
          <FieldText
            label="Sub-category"
            value={form.subCategory}
            onChange={(event) => updateForm("subCategory", event.target.value)}
            helperText="e.g. Antibiotic · Tablet, Monitoring, Sutures"
            fullWidth
          />
          <FieldText
            label="Manufacturer"
            value={form.manufacturer}
            onChange={(event) =>
              updateForm("manufacturer", event.target.value)
            }
            fullWidth
          />
          <FieldText
            label="Unit of measure"
            value={form.unit}
            onChange={(event) => updateForm("unit", event.target.value)}
            helperText="e.g. tablets, pieces, bottles"
            fullWidth
            required
          />
          <FieldText
            label="Opening quantity"
            type="number"
            value={form.quantity}
            onChange={(event) => updateForm("quantity", event.target.value)}
            fullWidth
            required
          />
          <FieldText
            label="Reorder level"
            type="number"
            value={form.reorderLevel}
            onChange={(event) =>
              updateForm("reorderLevel", event.target.value)
            }
            fullWidth
            required
          />
          <FieldText
            label="Purchase rate (INR)"
            type="number"
            value={form.purchaseRate}
            onChange={(event) =>
              updateForm("purchaseRate", event.target.value)
            }
            fullWidth
            required
          />
          <FieldText
            label="MRP / issue rate (INR)"
            type="number"
            value={form.mrp}
            onChange={(event) => updateForm("mrp", event.target.value)}
            fullWidth
            required
          />
          <FieldText
            label="Store location"
            value={form.location}
            onChange={(event) => updateForm("location", event.target.value)}
            helperText="e.g. Pharmacy / Rack A-03"
            fullWidth
            required
          />
        </div>
      </Modal>
    </div>
  );
}
