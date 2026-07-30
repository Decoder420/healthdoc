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


  // Only completed reports allowed
  const completedPatients =
    dummyPatients.filter(
      (item) =>
        item.reportStatus?.toLowerCase() ===
        "completed"
    );


  const patientOptions: PatientSearchOption[] =
    completedPatients.map((item) => ({
      patientId: item.patient.patientId,
      name: item.patient.name,
      uhid: item.patient.uhid,
      barcode: item.sample.barcode,
    }));


  const [data, setData] =
    useState<ResultEntryData | null>(
      completedPatients.length
        ? completedPatients[0]
        : null
    );


  const [interpretation, setInterpretation] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [recommendation, setRecommendation] =
    useState("");


  const [remarkError, setRemarkError] =
    useState("");


  const [approving, setApproving] =
    useState(false);



  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity:
        "success" as
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
        "Enter UHID, Barcode or Patient Name.",
        "warning"
      );

      return;
    }


    const value =
      search.toLowerCase();



    const patient =
      completedPatients.find((item) => {

        return (
          item.patient.uhid
            .toLowerCase() === value ||

          item.sample.barcode
            .toLowerCase() === value ||

          item.patient.name
            .toLowerCase()
            .includes(value)
        );

      });



    if (!patient) {

      showMessage(
        "No completed patient found.",
        "error"
      );

      return;
    }



    setData(patient);


    setInterpretation(
      patient.report.interpretation
    );


    setRemarks(
      patient.report.remarks
    );


    setRecommendation(
      patient.report.recommendation
    );


    setRemarkError("");


    showMessage(
      "Completed patient loaded successfully."
    );

  };





  const handleTestChange = (
    index: number,
    field: keyof LabTest,
    value: string
  ) => {

    if (!data) return;


    setData((prev) => {

      if (!prev) return prev;


      const updatedTests =
        [...prev.tests];


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

    showMessage(
      "Draft saved successfully."
    );

  };





  const validateRemarks = () => {

    if (!remarks.trim()) {

      setRemarkError(
        "Pathologist remark is required."
      );

      return false;

    }


    setRemarkError("");

    return true;

  };





  const handleApprove = () => {


    if (!validateRemarks()) {
      return;
    }


    setApproving(true);



    setTimeout(() => {


      setData((prev) => {

        if (!prev) return prev;


        return {

          ...prev,

          reportStatus: "Verified",

          report: {

            ...prev.report,

            remarks,

            verifiedBy:
              "Dr. Meena Kapoor",

            verifiedAt:
              new Date()
                .toLocaleString(),

          },

        };

      });



      setApproving(false);



      showMessage(
        "Report verified successfully.",
        "success"
      );


    },1500);


  };





  const handleReset = () => {


    const patient =
      completedPatients[0];


    if (!patient) {

      showMessage(
        "No completed patient available.",
        "warning"
      );

      return;
    }



    setData(patient);


    setInterpretation(
      patient.report.interpretation
    );


    setRemarks(
      patient.report.remarks
    );


    setRecommendation(
      patient.report.recommendation
    );


    setRemarkError("");

  };





  const handleAddRow = () => {


    if (!data) return;


    setData((prev)=>{

      if(!prev) return prev;


      return {

        ...prev,

        tests:[

          ...prev.tests,

          {

            id:
              `TEST-${Date.now()}`,

            testName:"",

            category:"",

            result:"",

            unit:"",

            referenceRange:"",

            flag:"-",

            remarks:"",

            status:"Pending",

          }

        ]

      };

    });


    showMessage(
      "New test row added."
    );

  };





  // No completed patient available
  if (!data) {

    return (

      <Container
        maxWidth="xl"
        sx={{
          py:4,
        }}
      >

        <Alert severity="warning">

          No completed pathology reports
          available for result entry.

        </Alert>

      </Container>

    );

  }





  return (

    <>

      <Container
        maxWidth="xl"
        sx={{
          py:4,
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
              Search completed patients,
              enter results and approve reports.
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
              fontWeight:700,
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

          remarkError={remarkError}

          onInterpretationChange={
            setInterpretation
          }

          onRemarksChange={(value)=>{

            setRemarks(value);

            setRemarkError("");

          }}

          onRecommendationChange={
            setRecommendation
          }

        />





        <ActionButtons

          onSaveDraft={handleSaveDraft}

          onApprove={handleApprove}

          onReset={handleReset}

          approving={approving}

        />


      </Container>





      <Snackbar

        open={snackbar.open}

        autoHideDuration={3000}

        anchorOrigin={{
          vertical:"top",
          horizontal:"right",
        }}

        onClose={()=>{

          setSnackbar((prev)=>({

            ...prev,

            open:false,

          }));

        }}

      >

        <Alert

          severity={snackbar.severity}

          variant="filled"

        >

          {snackbar.message}

        </Alert>


      </Snackbar>


    </>

  );

}