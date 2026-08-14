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
    id: "ITEM001",
    name: "X-Ray Film",
    department: "Radiology",
    stock: 120,
  },
  {
    id: "ITEM002",
    name: "Contrast Media",
    department: "Radiology",
    stock: 35,
  },
  {
    id: "ITEM003",
    name: "Blood Collection Tube",
    department: "Laboratory",
    stock: 250,
  },
  {
    id: "ITEM004",
    name: "Microscope Slides",
    department: "Laboratory",
    stock: 180,
  },
  {
    id: "ITEM005",
    name: "Surgical Gloves",
    department: "Operation Theatre",
    stock: 500,
  },
  {
    id: "ITEM006",
    name: "Syringes",
    department: "Emergency",
    stock: 320,
  },
  {
    id: "ITEM007",
    name: "Paracetamol 500 mg",
    department: "Pharmacy",
    stock: 120,
  },
  {
    id: "ITEM008",
    name: "Amoxicillin 250 mg",
    department: "Pharmacy",
    stock: 5,
  },
  {
    id: "ITEM009",
     name: "Pantoprazole 40 mg",
    department: "Pharmacy",
    stock: 85,
  },
  {
    id: "ITEM010",
    name: "Vitamin D3",
    department: "Pharmacy",
    stock: 10,
  },
];
