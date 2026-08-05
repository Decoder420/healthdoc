export type RadiologyQueueStatus =
  | "Queue"
  | "Processing"
  | "No Show"
  | "Removed"
  | "Verified";

export type RadiologyQueueItem = {
  id: number;

  orderId: string;
  accessionNumber: string;
  patientId: string;
  visitId: string;

  token: string;
  patientName: string;
  uhid: string;

  age: number;
  gender: "Male" | "Female";

  modality:
    | "CT"
    | "MRI"
    | "X-Ray"
    | "USG"
    | "Mammography"
    | "ECG";

  procedure: string;

  radiologist: string;

  appointmentDate: string;
  appointmentTime: string;

  priority: "Emergency" | "Urgent" | "Routine";

  status: RadiologyQueueStatus;

  reportAvailable: boolean;


  // ADD THESE

  reportId: string;

  reportStatus:
    | "Not Started"
    | "Draft"
    | "Verified";

  dicomStudyId: string;

  imageCount: number;
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
  "Arjun Malhotra",
  "Meera Krishnan",
  "Farhan Ali",
  "Pooja Deshmukh",
  "Nikhil Banerjee",
  "Ishita Bose",
  "Aditya Rao",
  "Shreya Menon",
  "Harsh Vardhan",
  "Tanvi Shah",
  "Manish Pillai",
  "Ritika Jain",
];


const RADIOLOGISTS = [
  "Dr. Mehta",
  "Dr. Sharma",
  "Dr. Gupta",
  "Dr. Nair",
  "Dr. Kapoor",
  "Dr. Iyer",
  "Dr. Banerjee",
  "Dr. Krishnan",
];


const PROCEDURES: Record<RadiologyQueueItem["modality"], string[]> = {
  CT: [
    "CT Brain",
    "CT Chest",
    "CT Abdomen",
    "CT KUB",
    "CT Angiography",
    "CT PNS",
  ],

  MRI: [
    "MRI Brain",
    "MRI Spine",
    "MRI Knee",
    "MRI Shoulder",
    "MRI Pelvis",
  ],

  "X-Ray": [
    "Chest PA View",
    "Knee AP/Lat",
    "Spine LS",
    "Hand AP",
    "Pelvis AP",
  ],

  USG: [
    "Whole Abdomen",
    "Pelvis",
    "Obstetric USG",
    "Thyroid",
    "Doppler Limb",
  ],

  Mammography: [
    "Bilateral Mammogram",
    "Unilateral Mammogram",
    "Screening Mammo",
  ],

  ECG: [
    "12-Lead ECG",
    "Stress ECG",
    "Holter Review",
  ],
};


const STATUSES: RadiologyQueueStatus[] = [
  "Queue",
  "Processing",
  "Verified",
  "No Show",
  "Removed",
];


const PRIORITIES: RadiologyQueueItem["priority"][] = [
  "Routine",
  "Urgent",
  "Emergency",
];


const MODALITIES =
  Object.keys(PROCEDURES) as RadiologyQueueItem["modality"][];


function todayPlus(days: number) {
  const date = new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}


function timeLabel(index: number) {
  const hour = 8 + (index % 10);
  const minute = (index * 7) % 60;

  const suffix = hour >= 12 ? "PM" : "AM";

  const h12 = ((hour + 11) % 12) + 1;

  return `${String(h12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}


export const appointmentQueue: RadiologyQueueItem[] =
  Array.from({ length: 180 }, (_, index) => {

    const modality =
      MODALITIES[index % MODALITIES.length];

    const procedures =
      PROCEDURES[modality];


    const dayBucket = index % 5;

    const dayOffset =
      dayBucket <= 2
        ? 0
        : dayBucket === 3
        ? -1
        : 1;


    const status =
      STATUSES[index % STATUSES.length];


    return {
      id: index + 1,

      orderId:
        `ORD-${String(index + 1).padStart(6, "0")}`,

      accessionNumber:
        `RAD-${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}-${String(index + 1).padStart(5, "0")}`,

      patientId:
        `PAT-${10000 + index}`,

      visitId:
        `VIS-${20000 + index}`,

      token:
        `RAD${String(index + 1).padStart(3, "0")}`,

      patientName:
        NAMES[index % NAMES.length],

      uhid:
        `UH${100245 + index}`,

      age:
        18 + ((index * 3) % 62),

      gender:
        index % 2 === 0
          ? "Male"
          : "Female",

      modality,

      procedure:
        procedures[index % procedures.length],

      radiologist:
        RADIOLOGISTS[index % RADIOLOGISTS.length],

      appointmentDate:
        todayPlus(dayOffset),

      appointmentTime:
        timeLabel(index),

      priority:
        PRIORITIES[index % PRIORITIES.length],

      status,

      reportAvailable:
  status === "Verified",


reportId:
  `REP-${String(index + 1).padStart(6, "0")}`,


reportStatus:
  status === "Verified"
    ? "Verified"
    : status === "Processing"
    ? "Draft"
    : "Not Started",


dicomStudyId:
  `STUDY-${100000 + index}`,


imageCount:
  modality === "ECG"
    ? 0
    : 20 + (index % 50),
    };
  });



export function getRadiologyQueueStats(
  list = appointmentQueue
) {
  return list.reduce(
    (stats, item) => {

      stats.total++;


      switch (item.status) {

        case "Queue":
          stats.inQueue++;
          break;


        case "Processing":
          stats.inProgress++;
          break;


        case "Verified":
          stats.verified++;
          stats.finished++;
          break;


        case "No Show":
          stats.noShow++;
          break;


        case "Removed":
          stats.removed++;
          break;
      }


      if (item.priority === "Emergency") {
        stats.emergency++;
      }


      return stats;
    },

    {
      inQueue: 0,
      emergency: 0,
      inProgress: 0,
      verified: 0,
      finished: 0,
      noShow: 0,
      removed: 0,
      total: 0,
    }
  );
}



export function getRadiologyModalityDistribution(
  list = appointmentQueue
) {

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

    value:
      list.filter(
        (item) =>
          item.modality === name
      ).length,

    color:
      colors[name],
  }));
}



export function getRadiologyPriorityDistribution(
  list = appointmentQueue
) {

  const priorityCount =
    list.reduce(
      (acc, item) => {

        acc[item.priority]++;

        return acc;

      },
      {
        Routine: 0,
        Urgent: 0,
        Emergency: 0,
      }
    );


  return [
    {
      name: "Routine",
      value: priorityCount.Routine,
      color: "#001F54",
    },

    {
      name: "Urgent",
      value: priorityCount.Urgent,
      color: "#F59E0B",
    },

    {
      name: "Emergency",
      value: priorityCount.Emergency,
      color: "#DC2626",
    },
  ];
}



export function getRadiologyImagingTrend(
  list = appointmentQueue
) {

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


  const today =
    new Date()
      .toISOString()
      .slice(0, 10);


  const todayList =
    list.filter(
      (item) =>
        item.appointmentDate === today
    );


  const todayData =
    hours.map((hour, index) => ({
      hour,

      scans:
        Math.max(
          4,
          todayList.filter(
            (_, i) =>
              i % hours.length === index
          ).length + index * 2
        ),
    }));


  const weekData =
    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
      .map((label, index) => ({
        hour: label,
        scans:
          Math.round(list.length * 0.7)
          + index * 12,
      }));


  const monthData =
    ["W1","W2","W3","W4"]
      .map((label,index)=>({
        hour: label,
        scans:
          list.length * 4 + index * 85,
      }));


  return {
    todayData,
    weekData,
    monthData,
  };
}



export const QUEUE_STATUS_FILTERS:
Array<"All" | RadiologyQueueStatus> = [
  "All",
  "Queue",
  "Processing",
  "Verified",
  "No Show",
  "Removed",
];