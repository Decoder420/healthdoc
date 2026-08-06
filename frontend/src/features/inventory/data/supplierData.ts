import type { Supplier } from "../types/supplier";

const STORAGE_KEY = "hospital_suppliers";

export const supplierData: Supplier[] = [
  {
    id: "SUP-001",
    name: "Surgical Care Pvt Ltd",
    contact_info: "+91 9876543210",
    is_active: true,
  },
  {
    id: "SUP-002",
    name: "Medico Healthcare",
    contact_info: "+91 9876543211",
    is_active: true,
  },
  {
    id: "SUP-003",
    name: "Apollo Medical Supplies",
    contact_info: "+91 9876543212",
    is_active: true,
  },
  {
    id: "SUP-004",
    name: "LifeCare Pharmaceuticals",
    contact_info: "+91 9876543213",
    is_active: true,
  },
  {
    id: "SUP-005",
    name: "HealthPlus Distributors",
    contact_info: "+91 9876543214",
    is_active: false,
  },
];

/*
 * ============================================================
 * GET SUPPLIERS
 * ============================================================
 */

export function getStoredSuppliers(): Supplier[] {
  if (typeof window === "undefined") {
    return supplierData;
  }

  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    /*
     * First visit:
     * seed localStorage.
     */

    if (!stored) {
      const initialData = [
        ...supplierData,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialData)
      );

      return initialData;
    }

    const parsed = JSON.parse(
      stored
    );

    /*
     * Invalid or empty storage:
     * restore seed data.
     */

    if (
      !Array.isArray(parsed) ||
      parsed.length === 0
    ) {
      const initialData = [
        ...supplierData,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialData)
      );

      return initialData;
    }

    return parsed as Supplier[];

  } catch (error) {
    console.error(
      "Failed to load suppliers:",
      error
    );

    return [
      ...supplierData,
    ];
  }
}

/*
 * ============================================================
 * SAVE ALL SUPPLIERS
 * ============================================================
 */

export function saveSuppliers(
  suppliers: Supplier[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(suppliers)
  );
}

/*
 * ============================================================
 * CREATE SUPPLIER
 * ============================================================
 */

export function createSupplier(
  supplier: Supplier
) {
  const suppliers =
    getStoredSuppliers();

  const updatedSuppliers = [
    supplier,
    ...suppliers,
  ];

  saveSuppliers(
    updatedSuppliers
  );

  return supplier;
}

/*
 * ============================================================
 * UPDATE SUPPLIER
 * ============================================================
 */

export function updateSupplier(
  updatedSupplier: Supplier
) {
  const suppliers =
    getStoredSuppliers();

  const updatedSuppliers =
    suppliers.map((supplier) =>
      supplier.id ===
      updatedSupplier.id
        ? updatedSupplier
        : supplier
    );

  saveSuppliers(
    updatedSuppliers
  );

  return updatedSupplier;
}