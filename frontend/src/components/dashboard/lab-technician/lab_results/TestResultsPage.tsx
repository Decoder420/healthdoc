"use client";

import { useState } from "react";

import {
  Chip,
  Stack,
  Alert,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";

import SearchPatient from "@/components/dashboard/lab-technician/lab_results/SearchPatient";
import PatientInfoCard from "@/components/dashboard/lab-technician/lab_results/PatientInfoCard";
import SampleInfoCard from "@/components/dashboard/lab-technician/lab_results/SampleInfoCard";
import TestResultsTable from "@/components/dashboard/lab-technician/lab_results/TestResultsTable";
import RemarksCard from "@/components/dashboard/lab-technician/lab_results/RemarksCard";
import ActionButtons from "@/components/dashboard/lab-technician/lab_results/ActionButtons";

import dummyPatients from "@/components/dashboard/lab-technician/lab_results/dummyData";
import {
  LabTest,
  ResultEntryData,
  PatientSearchOption,
} from "@/components/dashboard/lab-technician/lab_results/types";

export default function TestResultsPage() {
  const [search, setSearch] = useState("");

  const patientOptions: PatientSearchOption[] =
  dummyPatients.map((item) => ({
    patientId: item.patient.patientId,
    name: item.patient.name,
    uhid: item.patient.uhid,
    barcode: item.sample.barcode,
  }));

  const [data, setData] =
  useState<ResultEntryData>(dummyPatients[0]);

  const [interpretation, setInterpretation] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [recommendation, setRecommendation] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [approving, setApproving] =
    useState(false);

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity: "success" as
        | "success"
        | "warning"
        | "error"
        | "info",
    });

  const showMessage = (
    message: string,
    severity:
      | "success"
      | "warning"
      | "error"
      | "info" = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
   const handleSearch = () => {
  if (!search.trim()) {
    showMessage(
      "Please enter UHID, Barcode or Patient Name.",
      "warning"
    );
    return;
  }

  const patient = dummyPatients.find((item) => {
    const value = search.toLowerCase();

    return (
      item.patient.uhid.toLowerCase() === value ||
      item.sample.barcode.toLowerCase() === value ||
      item.patient.name.toLowerCase().includes(value)
    );
  });

  if (!patient) {
    showMessage("Patient not found.", "error");
    return;
  }

  setData(patient);

  setInterpretation(patient.report.interpretation);
  setRemarks(patient.report.remarks);
  setRecommendation(patient.report.recommendation);

  showMessage("Patient loaded successfully.");
};

  const handleTestChange = (
    index: number,
    field: keyof LabTest,
    value: string
  ) => {
    setData((prev) => {
      const updatedTests = [...prev.tests];

      updatedTests[index] = {
        ...updatedTests[index],
        [field]: value,
      };

      return {
        ...prev,
        tests: updatedTests,
      };
    });
  };

  const handleSaveDraft = () => {
    // TODO: Save draft API
    showMessage("Draft saved successfully.");
  };

  const handleSubmit = () => {
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      showMessage(
        "Results submitted for approval."
      );
    }, 1500);
  };

 const handleApprove = () => {
  setApproving(true);

  setTimeout(() => {
    setData((prev) => ({
      ...prev,
      reportStatus: "Verified",
      report: {
        ...prev.report,
        verifiedBy: "Dr. Meena Kapoor",
        verifiedAt: new Date().toLocaleString(),
      },
    }));

    setApproving(false);

    showMessage(
      "Report verified successfully.",
      "success"
    );
  }, 1500);
};

  const handlePreview = () => {
    // TODO: Open report preview
    showMessage(
      "Preview feature coming soon.",
      "info"
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setData(dummyPatients[0]);

setInterpretation(
  dummyPatients[0].report.interpretation
);

setRemarks(
  dummyPatients[0].report.remarks
);

setRecommendation(
  dummyPatients[0].report.recommendation
);
  };

  const handleAddRow = () => {
  setData((prev) => ({
    ...prev,
    tests: [
      ...prev.tests,
      {
        id: `TEST-${Date.now()}`,
        testName: "",
        category: "",
        result: "",
        unit: "",
        referenceRange: "",
        flag: "-",
        remarks: "",
        status: "Pending",
      },
    ],
  }));

  showMessage("New test row added.");
};
    return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  mb={4}
>
  <div>
    <Typography
      variant="h4"
      fontWeight={700}
    >
      Pathology Test Results
    </Typography>

    <Typography
      variant="body1"
      color="text.secondary"
    >
      Search patients, enter laboratory test results, review findings,
      and approve reports.
    </Typography>
  </div>

  <Chip
    label={data.reportStatus}
    color={
      data.reportStatus === "Verified"
        ? "success"
        : "warning"
    }
    sx={{
      fontWeight: 700,
      px: 1,
    }}
  />
</Stack>
       <SearchPatient
  search={search}
  patients={patientOptions}
  onSearchChange={setSearch}
  onSearch={handleSearch}
/>

        <PatientInfoCard
          patient={data.patient}
          doctor={data.doctor}
          visit={data.visit}
        />

        <SampleInfoCard
          sample={data.sample}
        />

       <TestResultsTable
  tests={data.tests}
  onChange={handleTestChange}
  onAddRow={handleAddRow}
/>

        <RemarksCard
          interpretation={interpretation}
          remarks={remarks}
          recommendation={recommendation}
          onInterpretationChange={
            setInterpretation
          }
          onRemarksChange={
            setRemarks
          }
          onRecommendationChange={
            setRecommendation
          }
        />

        <ActionButtons
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          onApprove={handleApprove}
          onPreview={handlePreview}
          onPrint={handlePrint}
          onReset={handleReset}
          submitting={submitting}
          approving={approving}
        />
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}