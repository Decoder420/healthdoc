export type RadiologyQueueItem = {
  id: number;
  token: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: "Male" | "Female";
  modality: "CT" | "MRI" | "X-Ray" | "USG" | "Mammography" | "ECG";
  procedure: string;
  radiologist: string;
  appointmentDate: string;
  appointmentTime: string;
  priority: "Emergency" | "Urgent" | "Routine";
  status: "Queue" | "In Progress" | "Completed" | "Reporting" | "Verified";
};

const NAMES = [
  "Rahul Sharma",
  "Priya Singh",
  "Amit Verma",
  "Sneha Kapoor",
  "Vikram Joshi",
  "Anjali Patel",
  "Karan Mehta",
  "Neha Gupta",
  "Rohit Das",
  "Kavya Nair",
  "Suresh Reddy",
  "Divya Iyer",
];

const RADIOLOGISTS = [
  "Dr. Mehta",
  "Dr. Sharma",
  "Dr. Gupta",
  "Dr. Nair",
  "Dr. Kapoor",
  "Dr. Iyer",
];

const PROCEDURES: Record<RadiologyQueueItem["modality"], string[]> = {
  CT: ["CT Brain", "CT Chest", "CT Abdomen", "CT KUB", "CT Angiography"],
  MRI: ["MRI Brain", "MRI Spine", "MRI Knee", "MRI Shoulder", "MRI Pelvis"],
  "X-Ray": ["Chest PA View", "Knee AP/Lat", "Spine LS", "PNS View", "Hand AP"],
  USG: ["Whole Abdomen", "Pelvis", "Obstetric USG", "Thyroid", "Doppler Limb"],
  Mammography: ["Bilateral Mammogram", "Unilateral Mammogram", "Screening Mammo"],
  ECG: ["12-Lead ECG", "Stress ECG", "Holter Review"],
};

const STATUSES: RadiologyQueueItem["status"][] = [
  "Queue",
  "Queue",
  "In Progress",
  "Reporting",
  "Completed",
  "Verified",
];

const PRIORITIES: RadiologyQueueItem["priority"][] = [
  "Routine",
  "Routine",
  "Urgent",
  "Emergency",
];

const MODALITIES = Object.keys(PROCEDURES) as RadiologyQueueItem["modality"][];

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function timeLabel(index: number) {
  const hour = 8 + (index % 10);
  const minute = (index * 7) % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = ((hour + 11) % 12) + 1;
  return `${String(h12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** Heavy radiology appointment queue for dashboard + queue page. */
export const appointmentQueue: RadiologyQueueItem[] = Array.from(
  { length: 120 },
  (_, index) => {
    const modality = MODALITIES[index % MODALITIES.length];
    const procedures = PROCEDURES[modality];
    // Bias ~50% of appointments to today so dashboard "today" filters stay full.
    const dayOffset = index % 2 === 0 ? 0 : -((index % 3) + 1);
    return {
      id: index + 1,
      token: `RAD${String(index + 1).padStart(3, "0")}`,
      patientName: NAMES[index % NAMES.length],
      uhid: `UH${100245 + index}`,
      age: 20 + ((index * 3) % 55),
      gender: index % 2 === 0 ? "Male" : "Female",
      modality,
      procedure: procedures[index % procedures.length],
      radiologist: RADIOLOGISTS[index % RADIOLOGISTS.length],
      appointmentDate: todayPlus(dayOffset),
      appointmentTime: timeLabel(index),
      priority: PRIORITIES[index % PRIORITIES.length],
      status: STATUSES[index % STATUSES.length],
    };
  },
);

export function getRadiologyQueueStats(list = appointmentQueue) {
  return {
    inQueue: list.filter((item) => item.status === "Queue").length,
    emergency: list.filter((item) => item.priority === "Emergency").length,
    inProgress: list.filter((item) => item.status === "In Progress").length,
    completed: list.filter(
      (item) => item.status === "Completed" || item.status === "Verified",
    ).length,
    reporting: list.filter((item) => item.status === "Reporting").length,
    total: list.length,
  };
}

export function getRadiologyModalityDistribution(list = appointmentQueue) {
  const colors: Record<string, string> = {
    CT: "#001F54",
    MRI: "#3B82F6",
    "X-Ray": "#06B6D4",
    USG: "#14B8A6",
    Mammography: "#F59E0B",
    ECG: "#8B5CF6",
  };
  return MODALITIES.map((name) => ({
    name,
    value: list.filter((item) => item.modality === name).length,
    color: colors[name],
  }));
}

export function getRadiologyPriorityDistribution(list = appointmentQueue) {
  return [
    {
      name: "Routine",
      value: list.filter((item) => item.priority === "Routine").length,
      color: "#001F54",
    },
    {
      name: "Urgent",
      value: list.filter((item) => item.priority === "Urgent").length,
      color: "#F59E0B",
    },
    {
      name: "Emergency",
      value: list.filter((item) => item.priority === "Emergency").length,
      color: "#DC2626",
    },
  ];
}

export function getRadiologyImagingTrend(list = appointmentQueue) {
  const hours = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const today = new Date().toISOString().slice(0, 10);
  const todayList = list.filter((item) => item.appointmentDate === today);
  const todayData = hours.map((hour, index) => ({
    hour,
    scans: Math.max(
      4,
      todayList.filter((_, i) => i % hours.length === index).length + index * 2,
    ),
  }));
  const weekData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (hour, index) => ({
      hour,
      scans: Math.round(list.length * 0.7) + index * 12,
    }),
  );
  const monthData = ["W1", "W2", "W3", "W4"].map((hour, index) => ({
    hour,
    scans: list.length * 4 + index * 85,
  }));
  return { todayData, weekData, monthData };
}
