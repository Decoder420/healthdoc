import type { Category } from "../types/category";

const STORAGE_KEY = "hospital_categories";

export const categoryData: Category[] = [
  {
    id: "CAT-001",
    code: "MED",
    name: "Medicine",
    description:
      "Medicines, drugs and pharmaceutical products.",
    itemCount: 0,
    isActive: true,
    createdAt: "05/08/2026",
  },

  {
    id: "CAT-002",
    code: "CON",
    name: "Consumables",
    description:
      "General medical and hospital consumables.",
    itemCount: 0,
    isActive: true,
    createdAt: "05/08/2026",
  },

  {
    id: "CAT-003",
    code: "SUR",
    name: "Surgical",
    description:
      "Surgical instruments and surgical supplies.",
    itemCount: 0,
    isActive: true,
    createdAt: "05/08/2026",
  },

  {
    id: "CAT-004",
    code: "LAB",
    name: "Laboratory",
    description:
      "Laboratory supplies, reagents and equipment.",
    itemCount: 0,
    isActive: true,
    createdAt: "05/08/2026",
  },

  {
    id: "CAT-005",
    code: "DIA",
    name: "Diagnostic",
    description:
      "Diagnostic and testing related products.",
    itemCount: 0,
    isActive: true,
    createdAt: "05/08/2026",
  },

  {
    id: "CAT-006",
    code: "GEN",
    name: "General Supplies",
    description:
      "General hospital supplies and miscellaneous items.",
    itemCount: 0,
    isActive: true,
    createdAt: "05/08/2026",
  },
];

export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") {
    return categoryData;
  }

  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(categoryData)
      );

      return categoryData;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(categoryData)
      );

      return categoryData;
    }

    return parsed as Category[];
  } catch (error) {
    console.error(
      "Failed to load categories:",
      error
    );

    return categoryData;
  }
}

export function saveCategories(
  categories: Category[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(categories)
  );
}