export const supplierStats = [
  { label: "Total Suppliers", value: "96" },
  { label: "Active", value: "88" },
  { label: "Inactive", value: "8", emphasis: "text-destructive" },
  { label: "Purchase Orders", value: "124" },
  { label: "Pending Deliveries", value: "12", emphasis: "text-amber-600" },
  { label: "New This Month", value: "6" },
];

export const supplierActivity = [
  { month: "Jan", suppliers: 12 },
  { month: "Feb", suppliers: 18 },
  { month: "Mar", suppliers: 15 },
  { month: "Apr", suppliers: 22 },
  { month: "May", suppliers: 20 },
  { month: "Jun", suppliers: 27 },
];

export const supplierDistribution = [
  { name: "Medicines", value: 45 },
  { name: "Consumables", value: 25 },
  { name: "Equipment", value: 18 },
  { name: "Laboratory", value: 12 },
];

export const recentSuppliers = [
  {
    id: "SUP-001",
    supplierCode: "SUP-001",
    supplierName: "MedPlus Distributors",
    contactPerson: "Amit Sharma",
    phone: "+91 98765 43210",
    email: "medplus@example.com",
    gst: "07ABCDE1234F1Z5",
    license: "DL-123456",
    address: "Delhi",
    contactInfo: "",
    active: true,
    joined: "Today",
  },
  {
    id: "SUP-002",
    supplierCode: "SUP-002",
    supplierName: "Sun Pharma Suppliers",
    contactPerson: "Rahul Gupta",
    phone: "+91 98111 22334",
    email: "sunpharma@example.com",
    gst: "07FGHIJ5678K1Z9",
    license: "DL-654321",
    address: "Noida",
    contactInfo: "",
    active: true,
    joined: "Yesterday",
  },
  {
    id: "SUP-003",
    supplierCode: "SUP-003",
    supplierName: "Care Medical Agencies",
    contactPerson: "Priya Verma",
    phone: "+91 98989 45454",
    email: "care@example.com",
    gst: "07LMNOP9876Q1Z2",
    license: "DL-789456",
    address: "Gurugram",
    contactInfo: "",
    active: false,
    joined: "22 Jul",
  },
];

export const topSuppliers = [
  {
    id: "SUP-001",
    name: "MedPlus Distributors",
    orders: 34,
    lastDelivery: "Today",
    status: "Excellent",
  },
  {
    id: "SUP-002",
    name: "Sun Pharma Suppliers",
    orders: 28,
    lastDelivery: "Yesterday",
    status: "Good",
  },
  {
    id: "SUP-003",
    name: "Care Medical Agencies",
    orders: 19,
    lastDelivery: "20 Jul",
    status: "Average",
  },
];