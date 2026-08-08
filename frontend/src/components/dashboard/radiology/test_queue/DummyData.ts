export type RadiologyQueueStatus =
  | "Queue"
  | "Processing"
  | "No Show"
  | "Removed"
  | "Verified";

export type RadiologyReportStatus =
  | "Not Started"
  | "Draft"
  | "Verified";

export type RadiologyModality =
  | "CT"
  | "MRI"
  | "X-Ray"
  | "USG"
  | "Mammography"
  | "ECG";

export type RadiologyPriority =
  | "Emergency"
  | "Urgent"
  | "Routine";

export type RadiologyQueueItem = {
  // ----------------------------------------------------------
  // Basic
  // ----------------------------------------------------------

  id: number;

  // ----------------------------------------------------------
  // Order
  // ----------------------------------------------------------

  orderId: string;
  accessionNumber: string;

  // ----------------------------------------------------------
  // Patient
  // ----------------------------------------------------------

  patientId: string;
  visitId: string;

  token: string;

  patientName: string;
  uhid: string;

  age: number;
  gender: "Male" | "Female";

  // ----------------------------------------------------------
  // Study
  // ----------------------------------------------------------

  modality: RadiologyModality;

  procedure: string;

  // ----------------------------------------------------------
  // Radiologist
  // ----------------------------------------------------------

  radiologist: string;

  // ----------------------------------------------------------
  // Appointment
  // ----------------------------------------------------------

  appointmentDate: string;
  appointmentTime: string;

  // ----------------------------------------------------------
  // Queue
  // ----------------------------------------------------------

  priority: RadiologyPriority;

  status: RadiologyQueueStatus;

  // ----------------------------------------------------------
  // Report
  // ----------------------------------------------------------

  reportAvailable: boolean;

  reportId: string;

  reportStatus: RadiologyReportStatus;

  verifiedAt?: string;

  // ----------------------------------------------------------
  // PACS / DICOM
  // ----------------------------------------------------------

  dicomStudyId: string;

  imageCount: number;
};

// ============================================================
// PATIENT NAMES
// ============================================================

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

// ============================================================
// RADIOLOGISTS
// ============================================================

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

// ============================================================
// PROCEDURES
// ============================================================

const PROCEDURES: Record<
  RadiologyQueueItem["modality"],
  string[]
> = {
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

// ============================================================
// STATUS LIST
// ============================================================

const STATUSES: RadiologyQueueStatus[] = [
  "Queue",
  "Processing",
  "Verified",
  "No Show",
  "Removed",
];

// ============================================================
// PRIORITY LIST
// ============================================================

const PRIORITIES: RadiologyQueueItem["priority"][] = [
  "Routine",
  "Urgent",
  "Emergency",
];

// ============================================================
// MODALITY LIST
// ============================================================

const MODALITIES =
  Object.keys(PROCEDURES) as RadiologyQueueItem["modality"][];

// ============================================================
// PATIENT COUNT
// ============================================================
//
// IMPORTANT:
//
// We intentionally reuse patients.
//
// Previously:
//
// 180 studies = 180 patients
//
// Now:
//
// 180 studies = 40 patients
//
// Therefore each patient can have multiple radiology studies.
//
// This makes the Patient Profile page much more realistic.
// ============================================================

const PATIENT_COUNT = 40;

// ============================================================
// DATE HELPER
// ============================================================

function todayPlus(days: number) {
  const date = new Date();

  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}

// ============================================================
// TIME HELPER
// ============================================================

function timeLabel(index: number) {
  const hour = 8 + (index % 10);

  const minute = (index * 7) % 60;

  const suffix = hour >= 12 ? "PM" : "AM";

  const h12 = ((hour + 11) % 12) + 1;

  return `${String(h12).padStart(
    2,
    "0"
  )}:${String(minute).padStart(
    2,
    "0"
  )} ${suffix}`;
}

// ============================================================
// VERIFIED DATE HELPER
// ============================================================

function verifiedDate(index: number) {
  const date = new Date();

  date.setDate(
    date.getDate() - (index % 7)
  );

  date.setHours(
    9 + (index % 8),
    (index * 11) % 60,
    0,
    0
  );

  return date.toISOString();
}

// ============================================================
// RADIOLOGY APPOINTMENT QUEUE
// ============================================================

export const appointmentQueue: RadiologyQueueItem[] =
  Array.from(
    { length: 180 },
    (_, index) => {
      // --------------------------------------------------------
      // Modality
      // --------------------------------------------------------

      const modality =
        MODALITIES[
          index % MODALITIES.length
        ];

      // --------------------------------------------------------
      // Procedures
      // --------------------------------------------------------

      const procedures =
        PROCEDURES[modality];

      // --------------------------------------------------------
      // Patient
      // --------------------------------------------------------
      //
      // Reuse patients so that one patient can have
      // multiple radiology studies.
      // --------------------------------------------------------

      const patientIndex =
        index % PATIENT_COUNT;

      const patientId =
        `PAT-${String(
          10000 + patientIndex
        )}`;

      const patientName =
        NAMES[
          patientIndex % NAMES.length
        ];

      const uhid =
        `UH${String(
          100245 + patientIndex
        )}`;

      const age =
        18 +
        ((patientIndex * 3) % 62);

      const gender =
        patientIndex % 2 === 0
          ? "Male"
          : "Female";

      // --------------------------------------------------------
      // Visit
      // --------------------------------------------------------

      const visitId =
        `VIS-${String(
          20000 + index
        )}`;

      // --------------------------------------------------------
      // Date
      // --------------------------------------------------------

      const dayBucket =
        index % 5;

      const dayOffset =
        dayBucket <= 2
          ? 0
          : dayBucket === 3
          ? -1
          : 1;

      // --------------------------------------------------------
      // Status
      // --------------------------------------------------------

      const status =
        STATUSES[
          index % STATUSES.length
        ];

      // --------------------------------------------------------
      // Report status
      // --------------------------------------------------------

      const reportStatus: RadiologyReportStatus =
        status === "Verified"
          ? "Verified"
          : status === "Processing"
          ? "Draft"
          : "Not Started";

      // --------------------------------------------------------
      // Report availability
      // --------------------------------------------------------

      const reportAvailable =
        status === "Verified";

      // --------------------------------------------------------
      // Report ID
      // --------------------------------------------------------

      const reportId =
        `REP-${String(
          index + 1
        ).padStart(6, "0")}`;

      // --------------------------------------------------------
      // DICOM Study ID
      // --------------------------------------------------------

      const dicomStudyId =
        `STUDY-${String(
          100000 + index
        )}`;

      // --------------------------------------------------------
      // Image count
      // --------------------------------------------------------

      const imageCount =
        modality === "ECG"
          ? 0
          : 20 + (index % 50);

      // --------------------------------------------------------
      // Return study
      // --------------------------------------------------------

      return {
        id: index + 1,

        // ------------------------------------------------------
        // Order
        // ------------------------------------------------------

        orderId:
          `ORD-${String(
            index + 1
          ).padStart(6, "0")}`,

        accessionNumber:
          `RAD-${new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "")}-${String(
            index + 1
          ).padStart(5, "0")}`,

        // ------------------------------------------------------
        // Patient
        // ------------------------------------------------------

        patientId,

        visitId,

        token:
          `RAD${String(
            index + 1
          ).padStart(3, "0")}`,

        patientName,

        uhid,

        age,

        gender,

        // ------------------------------------------------------
        // Study
        // ------------------------------------------------------

        modality,

        procedure:
          procedures[
            index % procedures.length
          ],

        // ------------------------------------------------------
        // Radiologist
        // ------------------------------------------------------

        radiologist:
          RADIOLOGISTS[
            index %
              RADIOLOGISTS.length
          ],

        // ------------------------------------------------------
        // Appointment
        // ------------------------------------------------------

        appointmentDate:
          todayPlus(dayOffset),

        appointmentTime:
          timeLabel(index),

        // ------------------------------------------------------
        // Queue
        // ------------------------------------------------------

        priority:
          PRIORITIES[
            index %
              PRIORITIES.length
          ],

        status,

        // ------------------------------------------------------
        // Report
        // ------------------------------------------------------

        reportAvailable,

        reportId,

        reportStatus,

        verifiedAt:
          status === "Verified"
            ? verifiedDate(index)
            : undefined,

        // ------------------------------------------------------
        // PACS / DICOM
        // ------------------------------------------------------

        dicomStudyId,

        imageCount,
      };
    }
  );

// ============================================================
// RADIOLOGY QUEUE STATS
// ============================================================

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

      if (
        item.priority ===
        "Emergency"
      ) {
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

// ============================================================
// RADIOLOGY MODALITY DISTRIBUTION
// ============================================================

export function getRadiologyModalityDistribution(
  list = appointmentQueue
) {
  const colors: Record<
    string,
    string
  > = {
    CT: "#001F54",

    MRI: "#3B82F6",

    "X-Ray": "#06B6D4",

    USG: "#14B8A6",

    Mammography: "#F59E0B",

    ECG: "#8B5CF6",
  };

  return MODALITIES.map(
    (name) => ({
      name,

      value:
        list.filter(
          (item) =>
            item.modality ===
            name
        ).length,

      color:
        colors[name],
    })
  );
}

// ============================================================
// RADIOLOGY PRIORITY DISTRIBUTION
// ============================================================

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

      value:
        priorityCount.Routine,

      color: "#001F54",
    },

    {
      name: "Urgent",

      value:
        priorityCount.Urgent,

      color: "#F59E0B",
    },

    {
      name: "Emergency",

      value:
        priorityCount.Emergency,

      color: "#DC2626",
    },
  ];
}

// ============================================================
// RADIOLOGY IMAGING TREND
// ============================================================

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

  // ----------------------------------------------------------
  // TODAY
  // ----------------------------------------------------------

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const todayList =
    list.filter(
      (item) =>
        item.appointmentDate ===
        today
    );

  const todayData =
    hours.map(
      (hour, index) => ({
        hour,

        scans:
          Math.max(
            4,

            todayList.filter(
              (_, i) =>
                i %
                  hours.length ===
                index
            ).length +
              index * 2
          ),
      })
    );

  // ----------------------------------------------------------
  // WEEK
  // ----------------------------------------------------------

  const weekData = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ].map(
    (label, index) => ({
      hour: label,

      scans:
        Math.round(
          list.length * 0.7
        ) +
        index * 12,
    })
  );

  // ----------------------------------------------------------
  // MONTH
  // ----------------------------------------------------------

  const monthData = [
    "W1",
    "W2",
    "W3",
    "W4",
  ].map(
    (label, index) => ({
      hour: label,

      scans:
        list.length * 4 +
        index * 85,
    })
  );

  return {
    todayData,

    weekData,

    monthData,
  };
}

// ============================================================
// QUEUE STATUS FILTERS
// ============================================================

export const QUEUE_STATUS_FILTERS:
  Array<
    "All" | RadiologyQueueStatus
  > = [
  "All",

  "Queue",

  "Processing",

  "Verified",

  "No Show",

  "Removed",
];