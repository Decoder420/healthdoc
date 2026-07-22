// utils/reportMapper.ts

import { ReportData } from "@/components/shared/labreportviewer/types/report";
import { VerifiedReportData } from "@/components/dashboard/lab-technician/Verification/types";

export function mapVerifiedReportToReportData(
  report: VerifiedReportData
): ReportData {
  return {
    status: "VERIFIED",

    laboratory: {
      id: "LAB-001",
      name: "ABC Diagnostics Laboratory",
      logo: "/images/logo.svg",
      nablNumber: "NABL-M-123456",
      address: "Pune",
      phone: "9876543210",
      email: "support@abc.com",
      website: "www.abc.com",
      tagline: "Accurate | Caring | Instant",
    },

    patient: {
      patientId: report.patient.patientId,
      uhid: report.patient.uhid,
      name: report.patient.name,
      age: report.patient.age,
      gender: report.patient.gender,
      dob: "",
      mobile: report.patient.mobile,
    },

    visit: {
      visitId: "",
      visitType: "OPD",
      encounterNumber: "",
    },

    doctor: {
      doctorId: report.doctor.id,
      name: report.doctor.name,
      qualification: "",
      department: report.doctor.department,
      registrationNumber: "",
      hospital: "",
    },

    order: {
      orderId: "",
      priority: "Routine",
      orderedAt: "",
    },

    sample: {
      accessionNumber: "",
      sampleId: report.sample.sampleId,
      barcode: report.sample.barcode,
      sampleType: report.sample.specimen,
      container: "",
      collectedAt: report.sample.collectedAt,
      receivedAt: "",
      processedAt: "",
    },

    reportInfo: {
      reportId: report.report.reportNo,
      reportNumber: report.report.reportNo,
      title: report.report.testName,
      category: "",
      method: "",
      reportedAt: report.report.verifiedDate,
      verifiedAt: report.report.verifiedDate,
    },

    testGroups: [
      {
        groupId: "RESULTS",
        groupName: report.report.testName,
        results: report.results.map((r, index) => ({
          code: `T${index + 1}`,
          name: r.testName,
          result: r.result,
          unit: r.unit,
          referenceRange: r.referenceRange,
          flag: r.flag,
          displayOrder: index + 1,
        })),
      },
    ],

    remarks: report.remarks,

    verification: {
      verifiedBy: report.report.verifiedBy,
      qualification: "",
      designation: "Pathologist",
      registrationNumber: "",
      verifiedAt: report.report.verifiedDate,
      digitalSignature: "",
      digitallySigned: true,
    },

    footer: {
      disclaimer: "Digitally Verified Report",
      generatedAt: report.report.verifiedDate,
      generatedBy: "LIS",
      version: 1,
      printedAt: report.report.verifiedDate,
    },

    qrCode: {
      value: report.report.reportNo,
    },
  };
}