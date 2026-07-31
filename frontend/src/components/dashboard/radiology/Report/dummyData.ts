import type { RadiologyReport } from "./types";
import { ALL_DEPARTMENT_CASES } from "../departments/departmentCases";

const HOSPITAL = {
  name: "ABC Multi Speciality Hospital",
  address: "Sector 62, Noida, Uttar Pradesh - 201309",
  phone: "+91 9876543210",
  email: "radiology@abchospital.com",
  website: "www.abchospital.com",
  logo: "/hospital-logo.png",
};

const MODALITY_MAP: Record<
  string,
  RadiologyReport["study"]["modality"]
> = {
  CT: "CT",
  MRI: "MRI",
  XRAY: "X-Ray",
  USG: "Ultrasound",
  MAMMOGRAPHY: "Mammography",
  ECG: "X-Ray",
};

const MACHINES: Record<string, string> = {
  CT: "Siemens Somatom Go.Top",
  MRI: "Siemens Magnetom 1.5T",
  XRAY: "GE Definium 646 HD",
  USG: "Philips Affiniti 70",
  MAMMOGRAPHY: "Hologic Dimensions",
  ECG: "GE MAC 2000",
};

function buildReportFromCase(
  item: (typeof ALL_DEPARTMENT_CASES)[number],
  index: number,
): RadiologyReport {
  const modality = MODALITY_MAP[item.modality] ?? "CT";
  const verified = item.status === "VERIFIED";

  return {
    id: item.id,
    hospital: HOSPITAL,
    report: {
      reportNo: `RAD-2026-${String(100125 + index).padStart(6, "0")}`,
      accessionNo: item.accessionNo,
      status: verified ? "VERIFIED" : "DRAFT",
      studyDate: item.studyDate.split("-").reverse().join("-"),
      reportDate: item.studyDate.split("-").reverse().join("-"),
    },
    patient: {
      uhid: item.uhid,
      name: item.patientName,
      age: 25 + (index % 45),
      gender: index % 2 === 0 ? "Male" : "Female",
      dob: "15-Jan-1984",
      mobile: `+91 98${String(70000000 + index).slice(0, 8)}`,
      address: "Sector 62, Noida",
    },
    doctor: {
      name: item.doctor,
      department: "Radiology",
    },
    visit: {
      type: index % 3 === 0 ? "IPD" : "OPD",
      visitNo: `VIS2026${String(15 + index).padStart(4, "0")}`,
    },
    study: {
      accessionNo: item.accessionNo,
      studyId: item.id,
      studyName: item.study,
      modality,
      bodyPart: item.study.split(" ").slice(-1)[0] || "Body",
      studyDate: item.studyDate.split("-").reverse().join("-"),
      studyTime: `${9 + (index % 8)}:${String((index * 7) % 60).padStart(2, "0")} AM`,
      priority:
        item.priority === "STAT"
          ? "Stat"
          : item.priority === "Urgent"
            ? "Urgent"
            : "Routine",
      technician: ["Ravi Kumar", "Anita Desai", "Sohan Patil"][index % 3],
      machine: MACHINES[item.modality] ?? "Imaging Unit",
      contrast: item.modality === "MRI" || item.modality === "CT" ? "Yes" : undefined,
    },
    clinicalHistory: `Clinical evaluation for ${item.study}. Correlate with prior imaging if available.`,
    images: [
      { id: "1", url: "/radiology/mri-1.jpg", title: "Series 1" },
      { id: "2", url: "/radiology/mri-2.jpg", title: "Series 2" },
      { id: "3", url: "/radiology/mri-3.jpg", title: "Series 3" },
    ],
    findings: verified
      ? `Study quality is adequate.\n\nNo acute abnormality identified in the current ${item.study}.\n\nVisualized structures appear within normal limits for age.`
      : "Findings pending radiologist review.",
    impression: verified
      ? `1. No acute abnormality on ${item.study}.\n2. Clinical correlation advised.`
      : "Impression pending.",
    radiologist: {
      name: "Dr. Priya Sharma",
      qualification: "MD (Radiodiagnosis)",
      designation: "Consultant Radiologist",
      registrationNo: "DMC/R/12345",
      signature: "/signature.png",
      verifiedOn: verified
        ? `${item.studyDate.split("-").reverse().join("-")} 11:45 AM`
        : "-",
    },
    generatedOn: `${item.studyDate.split("-").reverse().join("-")} 11:46 AM`,
  };
}

/** Reports keyed to department case ids so View Report works across modalities. */
export const radiologyReports: RadiologyReport[] = ALL_DEPARTMENT_CASES.map(
  (item, index) => buildReportFromCase(item, index),
);
