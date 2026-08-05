import type {
  RadiologyReport,
} from "./types";

import type {
  RadiologyQueueItem,
} from "../test_queue/DummyData";


const HOSPITAL = {
  name: "ABC Multi Speciality Hospital",
  address: "Sector 62, Noida, Uttar Pradesh - 201309",
  phone: "+91 9876543210",
  email: "radiology@abchospital.com",
  website: "www.abchospital.com",
  logo: "/hospital-logo.png",
};



const MACHINES: Record<string, string> = {

  CT:
    "Siemens Somatom Go.Top",

  MRI:
    "Siemens Magnetom 1.5T",

  "X-Ray":
    "GE Definium 646 HD",

  USG:
    "Philips Affiniti 70",

  Mammography:
    "Hologic Dimensions",

  ECG:
    "GE MAC 2000",

};



const FINDINGS: Record<string,string> = {

  CT:
    "Brain parenchyma shows normal attenuation.\n\nNo acute infarct, hemorrhage, or mass effect.",

  MRI:
    "MRI shows no significant abnormality. No acute pathology identified.",

  "X-Ray":
    "Chest X-Ray shows clear lung fields. Cardiac size within normal limits.",

  USG:
    "Ultrasound examination is within normal limits.",

  Mammography:
    "No suspicious mass or microcalcification identified.",

  ECG:
    "Sinus rhythm. No acute ST-T changes.",

};



const IMPRESSIONS: Record<string,string> = {

  CT:
    "No acute abnormality detected.",

  MRI:
    "No significant abnormality detected.",

  "X-Ray":
    "Normal radiograph.",

  USG:
    "Normal ultrasound study.",

  Mammography:
    "BI-RADS 2 - Benign.",

  ECG:
    "Normal sinus rhythm.",

};




export function buildReport(
  item: RadiologyQueueItem
): RadiologyReport {


  const verified =
    item.status === "Verified";


  const modality =
    item.modality;



  return {


    id:
      item.id,



    hospital:
      HOSPITAL,



    report: {


      reportNo:
        `RAD-${String(item.id).padStart(6,"0")}`,


      accessionNo:
        item.accessionNumber,


      status:
        verified
          ? "VERIFIED"
          : "DRAFT",


      studyDate:
        item.appointmentDate,


      reportDate:
        new Date()
          .toISOString()
          .slice(0,10),

    },



    patient: {


      uhid:
        item.uhid,


      name:
        item.patientName,


      age:
        item.age,


      gender:
        item.gender,


      dob:
        "15-Jan-1984",


      mobile:
        "+91 9876543210",


      address:
        "Sector 62, Noida",

    },



    doctor: {


      name:
        item.radiologist,


      department:
        "Radiology",

    },



    visit: {


      type:
        "OPD",


      visitNo:
        item.visitId,

    },



    study: {


      accessionNo:
        item.accessionNumber,


      studyId:
        item.dicomStudyId,


      studyName:
        item.procedure,


      modality:
        modality === "USG"
          ? "Ultrasound"
          : modality,


      bodyPart:
        item.procedure
          .split(" ")
          .pop() || "",


      studyDate:
        item.appointmentDate,


      studyTime:
        item.appointmentTime,


      priority:
        item.priority === "Emergency"
          ? "Stat"
          :
        item.priority === "Urgent"
          ? "Urgent"
          :
          "Routine",



      technician:
        "Radiology Technician",



      machine:
        MACHINES[modality],



      contrast:
        modality === "CT" ||
        modality === "MRI"
          ? "Yes"
          : "No",

    },



    clinicalHistory:

      `Clinical evaluation for ${item.procedure}.
       Correlate clinically.`,




    images:

      Array.from(
        {
          length:
            Math.min(item.imageCount,3)
        },
        (_,index)=>({

          id:
            String(index+1),

          url:
            `/radiology/image${index+1}.jpg`,

          title:
            `Series ${index+1}`

        })

      ),




    findings:

      verified
        ? FINDINGS[modality]
        : "Findings pending radiologist review.",




    impression:

      verified
        ? IMPRESSIONS[modality]
        : "Impression pending.",





    radiologist: {


      name:
        item.radiologist,


      qualification:
        "MD Radiodiagnosis",


      designation:
        "Consultant Radiologist",


      registrationNo:
        "DMC/R/12345",


      signature:
        "/signature.png",


      verifiedOn:
        verified
          ? new Date().toLocaleString()
          : "-",


    },



    generatedOn:
      new Date().toLocaleString(),


  };

}