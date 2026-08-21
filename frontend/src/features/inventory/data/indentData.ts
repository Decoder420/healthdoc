import type { IndentRequest } from "../types/indent";

const STORAGE_KEY = "hospital_indent_requests";

export const defaultIndentRequests: IndentRequest[] = [
  {
    id: "IND-001",
    requestNumber: "IND-20260729-001",

    departmentId: "DEPT-RAD-001",
    departmentName: "Radiology",

    requestedBy: "Dr. Amit Sharma",

    priority: "Normal",

    status: "Approved",

    items: 2,
    totalQuantity: 50,

    createdAt: "29 July 2026",

    remarks: "Radiology consumables required.",

    indentItems: [
      {
        id: "IND-ITEM-001",
        itemId: "ITEM001",
        itemName: "X-Ray Film",
        availableStock: 10,
        quantity: 30,
      },
      {
        id: "IND-ITEM-002",
        itemId: "ITEM002",
        itemName: "Contrast Media",
        availableStock: 5,
        quantity: 20,
      },
    ],
  },
];

/*
 * GET ALL INDENTS
 */
export const getIndentRequests = (): IndentRequest[] => {
  if (typeof window === "undefined") {
    return defaultIndentRequests;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultIndentRequests)
      );

      return defaultIndentRequests;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error(
      "Failed to load indent requests:",
      error
    );

    return defaultIndentRequests;
  }
};

/*
 * SAVE ALL INDENTS
 */
export const saveIndentRequests = (
  indents: IndentRequest[]
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(indents)
  );
};

/*
 * ADD NEW INDENT
 */
export const addIndentRequest = (
  indent: IndentRequest
) => {
  const existing = getIndentRequests();

  const updated = [
    indent,
    ...existing,
  ];

  saveIndentRequests(updated);

  return indent;
};

/*
 * UPDATE INDENT
 */


export const updateIndentRequest = (
  indentId: string,
  updates: Partial<IndentRequest>
) => {
  if (typeof window === "undefined") return;

  const current = getIndentRequests();

  const updated = current.map((indent) =>
    indent.id === indentId
      ? {
          ...indent,
          ...updates,
        }
      : indent
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};
/*
 * GET APPROVED INDENTS
 */
export const getApprovedIndentRequests =
  (): IndentRequest[] => {
    return getIndentRequests().filter(
      (indent) =>
        indent.status === "Approved"
    );
  };

/*
 * GET INDENT BY ID
 */
export const getIndentRequestById = (
  indentId: string
): IndentRequest | undefined => {
  return getIndentRequests().find(
    (indent) =>
      indent.id === indentId
  );
};

/*
 * INVENTORY ITEMS
 */
export const inventoryItems = [
  {
    id: "ITEM-001",
    name: "Paracetamol 500mg",
    stock: 40,
    departmentId: "PHARMACY",
    departmentName: "Pharmacy",
  },

  {
    id: "ITEM-002",
    name: "Amoxicillin 500mg",
    stock: 25,
    departmentId: "PHARMACY",
    departmentName: "Pharmacy",
  },

  {
    id: "ITEM-003",
    name: "Cetirizine 10mg",
    stock: 50,
    departmentId: "PHARMACY",
    departmentName: "Pharmacy",
  },

  {
    id: "ITEM-004",
    name: "CBC Reagent",
    stock: 30,
    departmentId: "LABORATORY",
    departmentName: "Laboratory",
  },

  {
    id: "ITEM-005",
    name: "Blood Collection Tube",
    stock: 100,
    departmentId: "LABORATORY",
    departmentName: "Laboratory",
  },

  {
    id: "ITEM-006",
    name: "X-Ray Film",
    stock: 20,
    departmentId: "RADIOLOGY",
    departmentName: "Radiology",
  },

  {
    id: "ITEM-007",
    name: "Ultrasound Gel",
    stock: 15,
    departmentId: "RADIOLOGY",
    departmentName: "Radiology",
  },

  {
    id: "ITEM-008",
    name: "Emergency IV Set",
    stock: 45,
    departmentId: "EMERGENCY",
    departmentName: "Emergency",
  },
];
