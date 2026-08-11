"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from "@mui/material";

import { patients } from "@/lib/mock/lab_data";

import PatientSearch, {
  Patient,
} from "./PatientSearch";

import PatientDetails from "./PatientDetails";

import OrderedTests from "./OrderedTest";

import SampleInformation, {
  SampleInformationData,
} from "./SampleCollection";

import BarcodeSection from "./BarcodeSection";

interface CollectSampleDialogProps {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
  onCollectSuccess: (orderId: string) => void;
}

const DEFAULT_SAMPLE_INFORMATION: SampleInformationData = {
  sampleType: "Blood",
  container: "EDTA Tube",
  priority: "Routine",
  collectionDate: "",
  collectionTime: "",
  collectedBy: "",
};

export default function CollectSampleDialog({
  open,
  orderId,
  onClose,
  onCollectSuccess,
}: CollectSampleDialogProps) {
  const router = useRouter();

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [barcode, setBarcode] = useState("");

  const [sampleInformation, setSampleInformation] =
    useState<SampleInformationData>(
      DEFAULT_SAMPLE_INFORMATION
    );

  /*
   * Load patient when dialog is opened
   * with a specific order ID.
   */
  useEffect(() => {
    if (!open) return;

    if (!orderId) {
      setSelectedPatient(null);
      return;
    }

    const patient = patients.find(
      (item) => item.order.orderId === orderId
    );

    if (!patient) {
      setSelectedPatient(null);
      return;
    }

    const mappedPatient: Patient = {
      id: patient.order.orderId,
      uhid: patient.patient.uhid,
      patientName: patient.patient.name,
      age: patient.patient.age,
      gender: patient.patient.gender,
      mobile: patient.patient.mobile,
      doctor: patient.doctor.name,
      department: patient.doctor.department,
      tests: patient.requestedTests,
    };

    setSelectedPatient(mappedPatient);

    /*
     * If this order already has a barcode,
     * show the existing barcode instead of
     * generating another one.
     */
    if (patient.sample?.barcode) {
      setBarcode(patient.sample.barcode);
    }
  }, [open, orderId]);

  /*
   * Generate barcode from the selected order.
   *
   * BarcodeSection itself prevents regeneration
   * after the first barcode has been generated.
   */
  const handleBarcodeGenerate = (generatedBarcode: string) => {
    setBarcode(generatedBarcode);
  };

  /*
   * Collect sample.
   */
  const handleCollectSample = () => {
    if (!selectedPatient || !barcode) return;

    const patient = patients.find(
      (item) =>
        item.order.orderId === selectedPatient.id
    );

    if (!patient) return;

    /*
     * Prevent duplicate sample collection.
     */
    if (patient.sample?.barcode) {
      onCollectSuccess(selectedPatient.id);
      onClose();
      router.push("/lab/pathology/sample");
      return;
    }

    /*
     * Generate sample ID from order ID.
     *
     * Example:
     * ORD001 -> SMP001
     */
    const orderNumber = patient.order.orderId
      .replace("ORD", "")
      .padStart(3, "0");

    const sampleId = `SMP${orderNumber}`;

    const now = new Date();

    const currentDate =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const currentTime =
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    /*
     * Update patient/order status.
     */
    patient.status = "PROCESSING";

    /*
     * Persist sample information.
     */
    patient.sample = {
      sampleId,
      barcode,
      sampleType:
        sampleInformation.sampleType,
      container:
        sampleInformation.container,
      collectedAt:
        `${currentDate} ${currentTime}`,
      collectedBy:
        sampleInformation.collectedBy,
    };

    /*
     * Notify parent component.
     */
    onCollectSuccess(selectedPatient.id);

    /*
     * Close dialog.
     */
    onClose();

    /*
     * Navigate back to sample collection.
     */
    router.push("/lab/pathology/sample");
  };

  /*
   * Reset dialog state.
   */
  const handleClose = () => {
    setSelectedPatient(null);
    setBarcode("");

    setSampleInformation({
      ...DEFAULT_SAMPLE_INFORMATION,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "1rem",
          fontWeight: 700,
        }}
      >
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          🧪 Collect Sample
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent
        sx={{
          px: {
            xs: 1.5,
            sm: 2.5,
          },
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Patient Search */}
          <PatientSearch
            value={selectedPatient}
            onChange={setSelectedPatient}
            disabled={Boolean(orderId)}
          />

          {/* Patient Details */}
          <PatientDetails
            patient={selectedPatient}
          />

          {/* Ordered Tests */}
          <OrderedTests
            patient={selectedPatient}
          />

          {/* Sample Information */}
          <SampleInformation
            value={sampleInformation}
            onChange={setSampleInformation}
          />

          {/* Barcode */}
          <BarcodeSection
            barcode={barcode}
            onGenerate={handleBarcodeGenerate}
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* Footer */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleClose}
          sx={{
            minWidth: 90,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          size="small"
          disabled={
            !selectedPatient ||
            !barcode ||
            !sampleInformation.collectedBy ||
            Boolean(
              selectedPatient &&
                patients.find(
                  (item) =>
                    item.order.orderId ===
                    selectedPatient.id
                )?.sample?.barcode
            )
          }
          onClick={handleCollectSample}
          sx={{
            minWidth: 130,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Collect Sample
        </Button>
      </DialogActions>
    </Dialog>
  );
}
