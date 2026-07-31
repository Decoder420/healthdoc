import { IndentRequest } from "../types/indent";

export const indentRequests: IndentRequest[] = [
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
];