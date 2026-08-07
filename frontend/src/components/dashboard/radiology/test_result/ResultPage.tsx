"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";


import ActionButtons from "./ActionButtons";
import FindingsCard from "./FindingsCard";
import ImageViewer from "./ImageViewer";
import ImpressionCard from "./ImpressionCard";
import PatientDetailsCard from "./PatientDetailsCard";
import RecommendationCard from "./RecommendationCard";
import SearchPatient from "./SearchPatient";
import StudyDetailsCard from "./StudyDetailsCard";


import {
  reportPatients,
  searchPatients,
} from "./dummyReportData";


import {
  saveReportDraft,
} from "./reportDraftStorage";


import type {
  PatientSearchOption,
  RadiologyReportPatient,
} from "./types";



export default function ReportEntryPage() {


  const router = useRouter();

  const searchParams =
    useSearchParams();



  const accessionNumber =
    searchParams.get(
      "accessionNumber"
    );




  const [search,setSearch] =
    useState("");



  const [
    selectedPatient,
    setSelectedPatient
  ] =
    useState<RadiologyReportPatient | null>(
      null
    );



  const [findings,setFindings] =
    useState("");



  const [impression,setImpression] =
    useState("");



  const [recommendation,setRecommendation] =
    useState("");



  const [findingsError,setFindingsError] =
    useState("");



  const [impressionError,setImpressionError] =
    useState("");



  const [loading,setLoading] =
    useState(false);





  const patientOptions =
    useMemo(
      () => searchPatients,
      []
    );







  // ================================
  // Load patient from URL
  // ================================

  useEffect(()=>{


    if(!accessionNumber)
      return;



    const patient =
      reportPatients.find(
        (item)=>
          item.accessionNumber === accessionNumber
      );



    if(patient){

      loadPatient(patient);

    }



  },[accessionNumber]);









  // ================================
  // Common patient loader
  // ================================

  const loadPatient =
    (
      patient: RadiologyReportPatient
    ) => {


      setSelectedPatient(
        patient
      );



      setSearch(
        patient.accessionNumber
      );



      setFindings(
        patient.report?.findings ?? ""
      );



      setImpression(
        patient.report?.impression ?? ""
      );



      setRecommendation(
        patient.report?.recommendation ?? ""
      );

    };









  // ================================
  // Search Button
  // ================================

  const handleSearch =
    (
      patient: PatientSearchOption
    ) => {


      console.log(
        "Search option:",
        patient
      );



      const fullPatient =
        reportPatients.find(
          (item)=>

            String(item.id) ===
            String(patient.id)

            ||

            item.accessionNumber ===
            patient.accessionNumber

            ||

            item.orderId ===
            patient.orderId

        );



      console.log(
        "Matched Patient:",
        fullPatient
      );




      if(!fullPatient){

        console.error(
          "Patient not found"
        );

        return;

      }




      loadPatient(
        fullPatient
      );


    };









  // ================================
  // Save Draft
  // ================================

  const persistDraft =
    (
      verified=false
    )=>{


      if(!selectedPatient)
        return;



      saveReportDraft(

        selectedPatient.accessionNumber,

        {

          findings,

          impression,

          recommendation,

          verified,

        }

      );

    };









  const openReport =
    (
      verified=false
    )=>{


      if(!selectedPatient)
        return;



      persistDraft(
        verified
      );



      router.push(

        `/radiology/reports/${selectedPatient.accessionNumber}`

      );


    };











  const handleSaveDraft =
    async()=>{


      if(!selectedPatient)
        return;



      setLoading(true);



      await new Promise(
        (resolve)=>
          setTimeout(resolve,1000)
      );



      persistDraft(false);



      setLoading(false);


    };











  const handleViewReport =
    ()=>{


      if(!findings.trim()){

        setFindingsError(
          "Findings are required"
        );

        return;

      }




      if(!impression.trim()){

        setImpressionError(
          "Impression is required"
        );

        return;

      }




      openReport(false);


    };









  const handleVerify =
    async()=>{


      let valid=true;




      if(!findings.trim()){

        setFindingsError(
          "Findings are required"
        );

        valid=false;

      }
      else{

        setFindingsError("");

      }





      if(!impression.trim()){

        setImpressionError(
          "Impression is required"
        );

        valid=false;

      }
      else{

        setImpressionError("");

      }






      if(!valid || !selectedPatient)
        return;





      setLoading(true);



      await new Promise(
        (resolve)=>
          setTimeout(resolve,1200)
      );



      setLoading(false);



      openReport(true);


    };











  const canVerify =
    findings.trim().length>0 &&
    impression.trim().length>0;









  return (

    <Box
      sx={{
        p:3
      }}
    >


      <Stack spacing={3}>


        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >


          <IconButton
            onClick={()=>
              router.back()
            }
          >

            <ArrowBackRoundedIcon/>

          </IconButton>



          <Typography
            variant="h4"
            fontWeight={700}
          >

            Enter Radiology Report

          </Typography>


        </Stack>





        <Divider/>







        <SearchPatient

          search={search}

          patients={patientOptions}

          onSearchChange={
            setSearch
          }

          onSearch={
            handleSearch
          }

        />









        {
          selectedPatient &&

          <>

            <Grid
              container
              spacing={3}
            >


              <Grid
                size={{
                  xs:12,
                  md:6
                }}
              >

                <PatientDetailsCard

                  patient={{

                    patientName:
                      selectedPatient.patientName,

                    uhid:
                      selectedPatient.uhid,

                    patientId:
                      selectedPatient.patientId,

                    visitId:
                      selectedPatient.visitId,

                    token:
                      selectedPatient.token,

                    age:
                      selectedPatient.age,

                    gender:
                      selectedPatient.gender,

                    priority:
                      selectedPatient.priority,

                  }}

                />

              </Grid>





              <Grid
                size={{
                  xs:12,
                  md:6
                }}
              >

                <StudyDetailsCard

                  study={{

                    modality:
                      selectedPatient.modality,

                    procedure:
                      selectedPatient.procedure,

                    radiologist:
                      selectedPatient.radiologist,

                    referringDoctor:
                      selectedPatient.referringDoctor,

                    accessionNumber:
                      selectedPatient.accessionNumber,

                    orderId:
                      selectedPatient.orderId,

                    appointmentDate:
                      selectedPatient.appointmentDate,

                    appointmentTime:
                      selectedPatient.appointmentTime,

                    studyStatus:
                      selectedPatient.studyStatus,

                  }}

                />

              </Grid>


            </Grid>







            <ImageViewer
              images={
                selectedPatient.images
              }
            />







            <FindingsCard

              value={findings}

              error={findingsError}

              onChange={(value)=>{

                setFindings(value);

                setFindingsError("");

              }}

            />







            <ImpressionCard

              value={impression}

              error={impressionError}

              onChange={(value)=>{

                setImpression(value);

                setImpressionError("");

              }}

            />







            <RecommendationCard

              value={recommendation}

              onChange={
                setRecommendation
              }

            />







            <ActionButtons

              loading={loading}

              canVerify={canVerify}

              onSaveDraft={
                handleSaveDraft
              }

              onVerify={
                handleVerify
              }

              onViewReport={
                handleViewReport
              }

            />



          </>


        }







        {
          !selectedPatient &&
          accessionNumber &&

          <Typography
            textAlign="center"
            color="error"
          >

            No study found for accession number:
            {" "}
            {accessionNumber}

          </Typography>

        }



      </Stack>


    </Box>

  );

}