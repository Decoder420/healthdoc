import type { RadiologyReport } from "./types";

export const radiologyReports: RadiologyReport[] = [
  {
    id: "MRI002",

    hospital: {
      name: "ABC Multi Speciality Hospital",
      address: "Sector 62, Noida, Uttar Pradesh - 201309",
      phone: "+91 9876543210",
      email: "radiology@abchospital.com",
      website: "www.abchospital.com",
      logo: "/hospital-logo.png",
    },

    report: {
      reportNo: "RAD-2026-000125",
      accessionNo: "ACC-202600145",
      status: "VERIFIED",
      studyDate: "28-Jul-2026",
      reportDate: "28-Jul-2026",
    },

    patient: {
      uhid: "UH102458",
      name: "Rahul Sharma",
      age: 42,
      gender: "Male",
      dob: "15-Jan-1984",
      mobile: "+91 9876543210",
      address: "Sector 62, Noida",
    },

    doctor: {
      name: "Dr. Amit Verma",
      department: "Neurology",
    },

    visit: {
      type: "OPD",
      visitNo: "VIS20260015",
    },

    study: {
      accessionNo: "ACC-202600145",
      studyId: "MRI002",
      studyName: "MRI Brain with Contrast",
      modality: "MRI",
      bodyPart: "Brain",
      studyDate: "28-Jul-2026",
      studyTime: "10:30 AM",
      priority: "Routine",
      technician: "Ravi Kumar",
      machine: "Siemens Magnetom 1.5T",
      contrast: "Gadolinium",
    },

    clinicalHistory: `

Patient complains of intermittent headache and dizziness
for the past two weeks.

Associated blurred vision.

No history of trauma or seizures.
`,

    images: [
      {
        id: "1",
        url: "/radiology/mri-1.jpg",
        title: "Axial T1",
      },
      {
        id: "2",
        url: "/radiology/mri-2.jpg",
        title: "Axial T2",
      },
      {
        id: "3",
        url: "/radiology/mri-3.jpg",
        title: "Coronal FLAIR",
      },
      {
        id: "4",
        url: "/radiology/mri-4.jpg",
        title: "Sagittal T1",
      },
    ],

    findings: `

The ventricles are normal in size and configuration.

Gray-white matter differentiation is maintained.

No evidence of acute infarction.

No intracranial hemorrhage.

No extra-axial collection.

Brainstem and cerebellum appear normal.

No abnormal post-contrast enhancement.

Visualized paranasal sinuses are clear.

`,

    impression: `

1. No acute intracranial abnormality.

2. No evidence of infarction or hemorrhage.

3. No abnormal post-contrast enhancement.

`,

    radiologist: {
      name: "Dr. Priya Sharma",
      qualification: "MD (Radiodiagnosis)",
      designation: "Consultant Radiologist",
      registrationNo: "DMC/R/12345",
      signature: "/signature.png",
      verifiedOn: "28-Jul-2026 11:45 AM",
    },

    generatedOn: "28-Jul-2026 11:46 AM",
  },
];