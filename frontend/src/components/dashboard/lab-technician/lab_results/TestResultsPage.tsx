
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Alert,
  Chip,
  Container,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import SearchPatient from "@/components/dashboard/lab-technician/lab_results/SearchPatient";
import PatientInfoCard from "@/components/dashboard/lab-technician/lab_results/PatientInfoCard";
import SampleInfoCard from "@/components/dashboard/lab-technician/lab_results/SampleInfoCard";
import TestResultsTable from "@/components/dashboard/lab-technician/lab_results/TestResultsTable";
import RemarksCard from "@/components/dashboard/lab-technician/lab_results/RemarksCard";
import ActionButtons from "@/components/dashboard/lab-technician/lab_results/ActionButtons";

import {
  patients as labPatients,
  LabPatientOrder,
} from "@/lib/mock/lab_data";

type LabResult = LabPatientOrder["results"][number];

export default function TestResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const completedPatients = labPatients.filter(
    (item) => item.status === "COMPLETED"
  );

  const [search, setSearch] = useState("");
  const [disableSearch, setDisableSearch] = useState(false);

  const [data, setData] =
    useState<LabPatientOrder | null>(null);

  const [approving, setApproving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [remarkError, setRemarkError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as
      | "success"
      | "error"
      | "warning",
  });

  const showMessage = (
    message: string,
    severity:
      | "success"
      | "error"
      | "warning" = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    if (orderId) {
      const patient = completedPatients.find(
        (item) => item.order.orderId === orderId
      );

      if (patient) {
        setData(patient);
        setSearch(patient.order.orderId);
        setDisableSearch(true);
      } else {
        showMessage("Order not found", "error");
      }
    } else {
      setData(completedPatients[0] ?? null);
    }
  }, [orderId]);

  const patientOptions = completedPatients;

  const handleSearch = () => {
    const value = search.toLowerCase().trim();

    const patient = completedPatients.find(
      (item) =>
        item.order.orderId
          .toLowerCase()
          .includes(value) ||
        item.patient.name
          .toLowerCase()
          .includes(value) ||
        item.patient.uhid
          .toLowerCase()
          .includes(value) ||
        item.sample.barcode
          .toLowerCase()
          .includes(value)
    );

    if (!patient) {
      showMessage(
        "Completed patient not found",
        "error"
      );
      return;
    }

    setData(patient);

    showMessage("Patient loaded successfully");
  };

  const handleTestChange = (
    index: number,
    field: keyof LabResult,
    value: string
  ) => {
    setData((prev) => {
      if (!prev) return prev;

      const updated = [...prev.results];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        results: updated,
      };
    });
  };

  const handleAddRow = () => {
    setData((prev) => {
      if (!prev) return prev;

      const newRow: LabResult = {
        id: `TEST-${Date.now()}`,
        testName: "",
        result: "",
        unit: "",
        referenceRange: "",
        flag: "-",
        remarks: "",
        status: "Pending",
      };

      return {
        ...prev,
        results: [...prev.results, newRow],
      };
    });
  };

  const handleReportChange = (
    field: keyof LabPatientOrder["report"],
    value: string
  ) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        report: {
          ...prev.report,
          [field]: value,
        },
      };
    });

    if (field === "remarks") {
      setRemarkError("");
    }
  };

  const handleSaveDraft = () => {
    setSaving(true);

    setTimeout(() => {
      setSaving(false);

      showMessage(
        "Draft saved successfully",
        "success"
      );
    }, 800);
  };

  const handleReset = () => {
    setResetting(true);

    setTimeout(() => {
      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          status: "COMPLETED",

          results: prev.results.map((test) => ({
            ...test,
            result: "",
            flag: "-",
            remarks: "",
            status: "Pending",
          })),

          report: {
            ...prev.report,
            interpretation: "",
            remarks: "",
            recommendation: "",
            verifiedBy: undefined,
            verifiedAt: undefined,
          },
        };
      });

      setRemarkError("");
      setResetting(false);

      showMessage(
        "Report reset successfully",
        "warning"
      );
    }, 500);
  };

  const handleApprove = () => {
    if (
      !data ||
      !data.report.remarks.trim()
    ) {
      setRemarkError(
        "Pathologist remark is required"
      );
      return;
    }

    setApproving(true);

    setTimeout(() => {
      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          status: "VERIFIED",

          report: {
            ...prev.report,
            verifiedBy: "Dr. Meena Kapoor",
            verifiedAt: new Date().toLocaleString(),
          },
        };
      });

      setApproving(false);

      showMessage(
        "Report verified successfully"
      );

      setTimeout(() => {
        router.push(
          "/lab/pathology/verification"
        );
      }, 1000);
    }, 1000);
  };

  if (!data) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">
          No completed reports available.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
      }}
    >
      {/* Page Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <div>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Pathology Test Results
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Enter results and verify reports.
          </Typography>
        </div>

        <Chip
          label={data.status}
          color={
            data.status === "VERIFIED" ||
            data.status === "COMPLETED"
              ? "success"
              : "warning"
          }
        />
      </Stack>

      {/* Search */}
      <SearchPatient
        search={search}
        patients={patientOptions}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        disabled={disableSearch}
      />

      {/* Patient Information */}
      <PatientInfoCard
        patient={data.patient}
        doctor={data.doctor}
        visit={data.visit}
      />

      {/* Sample Information */}
      <SampleInfoCard
        sample={data.sample}
        status={data.status}
      />

      {/* Test Results */}
      <TestResultsTable
        tests={data.results}
        onChange={handleTestChange}
        onAddRow={handleAddRow}
      />

      {/* Remarks */}
      <RemarksCard
        report={data.report}
        remarkError={remarkError}
        onChange={handleReportChange}
      />

      {/* Actions */}
      <ActionButtons
        onSaveDraft={handleSaveDraft}
        onApprove={handleApprove}
        onReset={handleReset}
        approving={approving}
        saving={saving}
        resetting={resetting}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
