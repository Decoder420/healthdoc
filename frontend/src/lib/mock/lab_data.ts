export const patients = [
{
  status: "QUEUE",

  patient: {
    patientId: "P006",
    uhid: "UHID000006",
    name: "Anjali Mehra",
    age: 27,
    gender: "Female",
    mobile: "9876543215",
  },

  visit: {
    visitId: "VIS006",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC006",
    name: "Dr. Vivek Sharma",
    department: "General Medicine",
  },

  order: {
    orderId: "ORD006",
    priority: "elective",
    orderedAt: "2026-07-15T10:10:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "Vitamin D",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P007",
    uhid: "UHID000007",
    name: "Rohit Jain",
    age: 45,
    gender: "Male",
    mobile: "9876543216",
  },

  visit: {
    visitId: "VIS007",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC007",
    name: "Dr. Aarti Kapoor",
    department: "Cardiology",
  },

  order: {
    orderId: "ORD007",
    priority: "emergency",
    orderedAt: "2026-07-15T10:20:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "Troponin I",
    "CK-MB",
    "D-Dimer",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P008",
    uhid: "UHID000008",
    name: "Meena Patel",
    age: 39,
    gender: "Female",
    mobile: "9876543217",
  },

  visit: {
    visitId: "VIS008",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC008",
    name: "Dr. Rajesh Nair",
    department: "Endocrinology",
  },

  order: {
    orderId: "ORD008",
    priority: "urgent",
    orderedAt: "2026-07-15T10:35:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "HbA1c",
    "Fasting Blood Sugar",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P009",
    uhid: "UHID000009",
    name: "Karan Singh",
    age: 51,
    gender: "Male",
    mobile: "9876543218",
  },

  visit: {
    visitId: "VIS009",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC009",
    name: "Dr. Neha Gupta",
    department: "Nephrology",
  },

  order: {
    orderId: "ORD009",
    priority: "elective",
    orderedAt: "2026-07-15T10:45:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "Serum Creatinine",
    "Blood Urea",
    "Electrolytes",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P010",
    uhid: "UHID000010",
    name: "Pooja Verma",
    age: 24,
    gender: "Female",
    mobile: "9876543219",
  },

  visit: {
    visitId: "VIS010",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC010",
    name: "Dr. Sandeep Kulkarni",
    department: "Gynecology",
  },

  order: {
    orderId: "ORD010",
    priority: "urgent",
    orderedAt: "2026-07-15T11:00:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "Thyroid Profile",
    "Iron Studies",
  ],

  results: [],
},
{
  status: "QUEUE",

  patient: {
    patientId: "P011",
    uhid: "UHID000011",
    name: "Arjun Malhotra",
    age: 33,
    gender: "Male",
    mobile: "9876543220",
  },

  visit: {
    visitId: "VIS011",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC011",
    name: "Dr. Priya Mehta",
    department: "Orthopedics",
  },

  order: {
    orderId: "ORD011",
    priority: "elective",
    orderedAt: "2026-07-15T11:10:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "Calcium",
    "Vitamin D",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P012",
    uhid: "UHID000012",
    name: "Neha Agarwal",
    age: 42,
    gender: "Female",
    mobile: "9876543221",
  },

  visit: {
    visitId: "VIS012",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC012",
    name: "Dr. Mohit Arora",
    department: "Pulmonology",
  },

  order: {
    orderId: "ORD012",
    priority: "emergency",
    orderedAt: "2026-07-15T11:20:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CRP",
    "Procalcitonin",
    "CBC",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P013",
    uhid: "UHID000013",
    name: "Sahil Khanna",
    age: 30,
    gender: "Male",
    mobile: "9876543222",
  },

  visit: {
    visitId: "VIS013",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC013",
    name: "Dr. Kavita Rao",
    department: "Dermatology",
  },

  order: {
    orderId: "ORD013",
    priority: "elective",
    orderedAt: "2026-07-15T11:35:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "IgE",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P014",
    uhid: "UHID000014",
    name: "Ritu Bansal",
    age: 56,
    gender: "Female",
    mobile: "9876543223",
  },

  visit: {
    visitId: "VIS014",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC014",
    name: "Dr. Ashish Jain",
    department: "Gastroenterology",
  },

  order: {
    orderId: "ORD014",
    priority: "urgent",
    orderedAt: "2026-07-15T11:50:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "LFT",
    "Amylase",
    "Lipase",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P015",
    uhid: "UHID000015",
    name: "Deepak Yadav",
    age: 61,
    gender: "Male",
    mobile: "9876543224",
  },

  visit: {
    visitId: "VIS015",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC015",
    name: "Dr. Shalini Verma",
    department: "Neurology",
  },

  order: {
    orderId: "ORD015",
    priority: "emergency",
    orderedAt: "2026-07-15T12:05:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "Electrolytes",
    "Blood Glucose",
    "LFT",
    "KFT",
  ],

  results: [],
},
{
  status: "QUEUE",

  patient: {
    patientId: "P016",
    uhid: "UHID000016",
    name: "Ankit Sharma",
    age: 37,
    gender: "Male",
    mobile: "9876543225",
  },

  visit: {
    visitId: "VIS016",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC016",
    name: "Dr. Rohan Kapoor",
    department: "General Medicine",
  },

  order: {
    orderId: "ORD016",
    priority: "elective",
    orderedAt: "2026-07-15T12:15:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "Urine Routine",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P017",
    uhid: "UHID000017",
    name: "Kavya Nair",
    age: 29,
    gender: "Female",
    mobile: "9876543226",
  },

  visit: {
    visitId: "VIS017",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC017",
    name: "Dr. Neeraj Singh",
    department: "Endocrinology",
  },

  order: {
    orderId: "ORD017",
    priority: "urgent",
    orderedAt: "2026-07-15T12:25:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "HbA1c",
    "Fasting Blood Sugar",
    "Insulin",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P018",
    uhid: "UHID000018",
    name: "Mohit Choudhary",
    age: 49,
    gender: "Male",
    mobile: "9876543227",
  },

  visit: {
    visitId: "VIS018",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC018",
    name: "Dr. Asha Menon",
    department: "Nephrology",
  },

  order: {
    orderId: "ORD018",
    priority: "emergency",
    orderedAt: "2026-07-15T12:35:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "KFT",
    "Electrolytes",
    "Creatinine",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P019",
    uhid: "UHID000019",
    name: "Simran Kaur",
    age: 41,
    gender: "Female",
    mobile: "9876543228",
  },

  visit: {
    visitId: "VIS019",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC019",
    name: "Dr. Vikram Joshi",
    department: "Cardiology",
  },

  order: {
    orderId: "ORD019",
    priority: "elective",
    orderedAt: "2026-07-15T12:45:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "Lipid Profile",
    "Troponin I",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P020",
    uhid: "UHID000020",
    name: "Harsh Gupta",
    age: 55,
    gender: "Male",
    mobile: "9876543229",
  },

  visit: {
    visitId: "VIS020",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC020",
    name: "Dr. Sneha Kulkarni",
    department: "Internal Medicine",
  },

  order: {
    orderId: "ORD020",
    priority: "emergency",
    orderedAt: "2026-07-15T13:00:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "LFT",
    "KFT",
    "Blood Culture",
  ],

  results: [],
},
{
  status: "QUEUE",

  patient: {
    patientId: "P021",
    uhid: "UHID000021",
    name: "Nisha Sharma",
    age: 32,
    gender: "Female",
    mobile: "9876543230",
  },

  visit: {
    visitId: "VIS021",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC021",
    name: "Dr. Anil Verma",
    department: "General Medicine",
  },

  order: {
    orderId: "ORD021",
    priority: "urgent",
    orderedAt: "2026-07-15T13:10:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "CRP",
    "ESR",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P022",
    uhid: "UHID000022",
    name: "Akash Mehta",
    age: 40,
    gender: "Male",
    mobile: "9876543231",
  },

  visit: {
    visitId: "VIS022",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC022",
    name: "Dr. Pooja Shah",
    department: "Neurology",
  },

  order: {
    orderId: "ORD022",
    priority: "elective",
    orderedAt: "2026-07-15T13:20:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "Vitamin B12",
    "Vitamin D",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P023",
    uhid: "UHID000023",
    name: "Sonia Kapoor",
    age: 26,
    gender: "Female",
    mobile: "9876543232",
  },

  visit: {
    visitId: "VIS023",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC023",
    name: "Dr. Rajesh Gupta",
    department: "Gynecology",
  },

  order: {
    orderId: "ORD023",
    priority: "emergency",
    orderedAt: "2026-07-15T13:35:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "CBC",
    "Beta HCG",
    "Blood Group",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P024",
    uhid: "UHID000024",
    name: "Ramesh Yadav",
    age: 63,
    gender: "Male",
    mobile: "9876543233",
  },

  visit: {
    visitId: "VIS024",
    visitType: "IPD",
  },

  doctor: {
    doctorId: "DOC024",
    name: "Dr. Vivek Nair",
    department: "Nephrology",
  },

  order: {
    orderId: "ORD024",
    priority: "emergency",
    orderedAt: "2026-07-15T13:45:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "KFT",
    "Electrolytes",
    "Urine Routine",
    "Creatinine",
  ],

  results: [],
},

{
  status: "QUEUE",

  patient: {
    patientId: "P025",
    uhid: "UHID000025",
    name: "Pallavi Desai",
    age: 38,
    gender: "Female",
    mobile: "9876543234",
  },

  visit: {
    visitId: "VIS025",
    visitType: "OPD",
  },

  doctor: {
    doctorId: "DOC025",
    name: "Dr. Kunal Mehra",
    department: "Endocrinology",
  },

  order: {
    orderId: "ORD025",
    priority: "urgent",
    orderedAt: "2026-07-15T14:00:00Z",
  },

  sample: {
    sampleId: "",
    barcode: "",
    sampleType: "",
    container: "",
    collectedAt: "",
  },

  requestedTests: [
    "HbA1c",
    "Fasting Blood Sugar",
    "Thyroid Profile",
  ],

  results: [],
}
]