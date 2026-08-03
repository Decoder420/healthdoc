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

const MODALITY_MAP: Record<string, RadiologyReport["study"]["modality"]> = {
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

const FINDINGS_BY_MODALITY: Record<string, string[]> = {
  CT: [
    "Study quality is adequate with no motion artifact.\n\nBrain parenchyma shows normal attenuation. No acute infarct, hemorrhage, or mass effect.\n\nVentricular system and basal cisterns are preserved.",
    "Chest CT demonstrates clear lung fields bilaterally.\n\nNo consolidations, nodules, or pleural effusion.\n\nMediastinal structures are within normal limits.",
    "Abdomen CT shows normal liver, spleen, and pancreas.\n\nNo free fluid or lymphadenopathy.\n\nBowel loops appear unremarkable.",
  ],
  MRI: [
    "MRI Brain: No restricted diffusion. Grey-white differentiation preserved.\n\nNo abnormal enhancement post contrast.\n\nParanasal sinuses and orbits are unremarkable.",
    "Spine MRI: Disc hydration maintained at most levels.\n\nMild degenerative changes without significant canal stenosis.\n\nCord signal intensity is normal.",
    "Joint MRI: Articular cartilage intact. No meniscal tear or ligament disruption.\n\nMild joint effusion may be physiologic.\n\nSurrounding soft tissues unremarkable.",
  ],
  XRAY: [
    "Chest radiograph (PA): Lung fields are clear. Cardiac silhouette is normal in size.\n\nCostophrenic angles are sharp. No bony abnormality.",
    "Skeletal radiograph: Alignment maintained. No acute fracture or dislocation.\n\nJoint spaces preserved. Soft tissues unremarkable.",
    "Skull views: Calvarium intact. No lytic or sclerotic lesion. Soft tissues normal.",
  ],
  USG: [
    "Ultrasound abdomen: Liver normal in size and echotexture. No focal lesion.\n\nGallbladder, CBD, and pancreas appear normal. Kidneys show normal corticomedullary differentiation.\n\nNo free fluid.",
    "Pelvic USG: Uterus and adnexa appear within normal limits for age/cycle phase.\n\nNo adnexal mass or free fluid in pouch of Douglas.",
    "Doppler study: Spectral waveforms demonstrate normal flow velocities.\n\nNo evidence of thrombosis or significant stenosis.",
  ],
  MAMMOGRAPHY: [
    "Bilateral mammogram: Breast parenchyma density is scattered fibroglandular (ACR B).\n\nNo suspicious mass, architectural distortion, or clustered microcalcifications.\n\nBI-RADS 2 — Benign.",
    "Screening mammogram: Stable benign calcifications. Skin and nipple unremarkable.\n\nAxillary nodes not enlarged. BI-RADS 2.",
    "Diagnostic mammogram with tomosynthesis: Focal asymmetry resolves on additional views.\n\nNo suspicious findings. BI-RADS 2.",
  ],
  ECG: [
    "12-lead ECG: Sinus rhythm. Normal axis. No acute ST-T changes.\n\nPR, QRS, and QTc intervals within normal limits.\n\nNo evidence of acute ischemia.",
    "Stress ECG: Patient exercised to target heart rate. No significant ST depression or arrhythmia.\n\nRecovery phase uneventful.",
    "Rhythm strip: Sinus rhythm with occasional premature atrial complexes.\n\nNo sustained arrhythmia recorded.",
  ],
};

const IMPRESSIONS_BY_MODALITY: Record<string, string[]> = {
  CT: [
    "1. No acute intracranial abnormality.\n2. Clinical correlation advised.",
    "1. Normal CT chest study.\n2. Correlate with clinical findings if symptoms persist.",
    "1. No acute abdominal pathology on CT.\n2. Suggest correlation with labs if indicated.",
  ],
  MRI: [
    "1. Normal MRI brain study.\n2. No acute infarct or space-occupying lesion.",
    "1. Mild degenerative spine changes without neural compression.\n2. Conservative management may be considered.",
    "1. No acute internal derangement.\n2. Clinical correlation recommended.",
  ],
  XRAY: [
    "1. Normal chest radiograph.\n2. No acute cardiopulmonary process.",
    "1. No acute bony injury.\n2. Correlate with clinical examination.",
    "1. Normal radiographic study.\n2. Further imaging if clinically indicated.",
  ],
  USG: [
    "1. Normal ultrasound abdomen.\n2. No sonographic evidence of acute pathology.",
    "1. Normal pelvic ultrasound.\n2. Clinical follow-up as needed.",
    "1. Normal Doppler study.\n2. No vascular obstruction identified.",
  ],
  MAMMOGRAPHY: [
    "1. BI-RADS 2 — Benign findings.\n2. Routine screening as per guidelines.",
    "1. Stable benign mammogram.\n2. Continue annual screening.",
    "1. No mammographic evidence of malignancy.\n2. BI-RADS 2.",
  ],
  ECG: [
    "1. Normal sinus rhythm ECG.\n2. No acute ischemic changes.",
    "1. Negative stress ECG for inducible ischemia.\n2. Clinical correlation advised.",
    "1. Sinus rhythm with occasional PACs.\n2. No sustained arrhythmia.",
  ],
};

const CLINICAL_HISTORY: string[] = [
  "Clinical evaluation for {study}. Correlate with prior imaging if available.",
  "Referred for {study} with complaints of pain / discomfort. Rule out acute pathology.",
  "Pre-operative workup — {study} requested by referring clinician.",
  "Follow-up {study} after prior abnormal findings. Compare with previous study if available.",
  "Emergency referral for {study}. STAT reporting requested.",
];

function buildReportFromCase(
  item: (typeof ALL_DEPARTMENT_CASES)[number],
  index: number,
): RadiologyReport {
  const modality = MODALITY_MAP[item.modality] ?? "CT";
  const verified = item.status === "VERIFIED";
  const findingsPool =
    FINDINGS_BY_MODALITY[item.modality] ?? FINDINGS_BY_MODALITY.CT;
  const impressionPool =
    IMPRESSIONS_BY_MODALITY[item.modality] ?? IMPRESSIONS_BY_MODALITY.CT;
  const variant = index % findingsPool.length;

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
      technician: ["Ravi Kumar", "Anita Desai", "Sohan Patil", "Meena Kulkarni"][
        index % 4
      ],
      machine: MACHINES[item.modality] ?? "Imaging Unit",
      contrast:
        item.modality === "MRI" || item.modality === "CT" ? "Yes" : undefined,
    },
    clinicalHistory: CLINICAL_HISTORY[index % CLINICAL_HISTORY.length].replace(
      "{study}",
      item.study,
    ),
    images: [
      { id: "1", url: "/radiology/mri-1.jpg", title: "Series 1 — Scout" },
      { id: "2", url: "/radiology/mri-2.jpg", title: "Series 2 — Axial" },
      { id: "3", url: "/radiology/mri-3.jpg", title: "Series 3 — Coronal" },
      ...(verified
        ? [
            {
              id: "4",
              url: "/radiology/mri-1.jpg",
              title: "Series 4 — Annotated",
            },
          ]
        : []),
    ],
    findings: verified
      ? findingsPool[variant]
      : "Findings pending radiologist review.",
    impression: verified
      ? impressionPool[variant]
      : "Impression pending.",
    radiologist: {
      name: ["Dr. Priya Sharma", "Dr. Rajesh Mehta", "Dr. Ananya Iyer"][
        index % 3
      ],
      qualification: "MD (Radiodiagnosis)",
      designation: "Consultant Radiologist",
      registrationNo: `DMC/R/${12345 + (index % 40)}`,
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
