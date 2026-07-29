"use client";

import { useEffect, useState } from "react";

import { patients } from "@/lib/mock/lab_data";

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

import PatientSearch, { Patient } from "./PatientSearch";
import PatientDetails from "./PatientDetails";
import OrderedTests from "./OrderedTest";
import SampleInformation, {
  SampleInformationData,
} from "./SampleCollection";
import BarcodeSection from "./BarcodeSection";

interface CollectSampleDialogProps {
  open: boolean;
  patientId: string | null;
  onClose: () => void;
}

export default function CollectSampleDialog({
  open,
  patientId,
  onClose,
}: CollectSampleDialogProps) {
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [barcode, setBarcode] = useState("");

  const [sampleInformation, setSampleInformation] =
    useState<SampleInformationData>({
      sampleType: "Blood",
      container: "EDTA Tube",
      priority: "Routine",
      collectionDate: "",
      collectionTime: "",
      collectedBy: "",
    });

  useEffect(() => {
    if (!patientId) {
      setSelectedPatient(null);
      return;
    }

    const patient = patients.find(
      (p) => p.patient.patientId === patientId
    );

    if (!patient) {
      setSelectedPatient(null);
      return;
    }

    // Convert original mock data into Patient type
    const mappedPatient: Patient = {
      id: patient.patient.patientId,
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
  }, [patientId]);

  const handleCollectSample = () => {
    console.log({
      patient: selectedPatient,
      sampleInformation,
      barcode,
    });

    // TODO:
    // API Call
    // Close dialog
    // Refresh table
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        🧪 Collect Sample

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            py: 2,
          }}
        >
          <PatientSearch
            value={selectedPatient}
            onChange={setSelectedPatient}
            disabled={!!patientId}
          />

          <PatientDetails patient={selectedPatient} />

          <OrderedTests patient={selectedPatient} />

          <SampleInformation
            value={sampleInformation}
            onChange={setSampleInformation}
          />

          <BarcodeSection
            barcode={barcode}
            onGenerate={setBarcode}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!selectedPatient || !barcode}
          onClick={handleCollectSample}
        >
          Collect Sample
        </Button>
      </DialogActions>
    </Dialog>
  );
}