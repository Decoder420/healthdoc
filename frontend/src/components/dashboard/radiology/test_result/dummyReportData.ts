import { appointmentQueue } from "../test_queue/DummyData";

import type {
  PatientSearchOption,
  RadiologyReportPatient,
} from "./types";

export const reportPatients: RadiologyReportPatient[] =
  appointmentQueue.map((patient, index) => ({
    id: patient.id,

    orderId: patient.orderId,

    accessionNumber: patient.accessionNumber,

    patientId: patient.patientId,

    visitId: patient.visitId,

    token: patient.token,

    patientName: patient.patientName,

    uhid: patient.uhid,

    age: patient.age,

    gender: patient.gender,

    modality: patient.modality,

    procedure: patient.procedure,

    radiologist: patient.radiologist,

    referringDoctor: `Dr. ${
      [
        "Sharma",
        "Verma",
        "Gupta",
        "Kapoor",
        "Nair",
        "Iyer",
        "Patel",
        "Singh",
      ][index % 8]
    }`,

    appointmentDate: patient.appointmentDate,

    appointmentTime: patient.appointmentTime,

    priority: patient.priority,

    studyStatus: patient.status,

    images: [
      {
        id: 1,
        imageUrl:
          "https://picsum.photos/900/700?random=1",
        thumbnailUrl:
          "https://picsum.photos/150/100?random=1",
      },
      {
        id: 2,
        imageUrl:
          "https://picsum.photos/900/700?random=2",
        thumbnailUrl:
          "https://picsum.photos/150/100?random=2",
      },
      {
        id: 3,
        imageUrl:
          "https://picsum.photos/900/700?random=3",
        thumbnailUrl:
          "https://picsum.photos/150/100?random=3",
      },
      {
        id: 4,
        imageUrl:
          "https://picsum.photos/900/700?random=4",
        thumbnailUrl:
          "https://picsum.photos/150/100?random=4",
      },
      {
        id: 5,
        imageUrl:
          "https://picsum.photos/900/700?random=5",
        thumbnailUrl:
          "https://picsum.photos/150/100?random=5",
      },
    ],

    report: {
      findings: "",
      impression: "",
      recommendation: "",
    },
  }));

export const searchPatients: PatientSearchOption[] =
  reportPatients.map((patient) => ({
    id: patient.orderId,

    patientName: patient.patientName,

    uhid: patient.uhid,

    accessionNumber: patient.accessionNumber,

    orderId: patient.orderId,
  }));