"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Box } from "@mui/material";

import {
  patients as initialPatients,
  LabPatientOrder,
} from "@/lib/mock/lab_data";

import SampleCollectionHeader from "@/components/dashboard/lab-technician/Sample_collection/Header";
import SampleKPICards from "@/components/dashboard/lab-technician/Sample_collection/cards";
import SampleCollectionTable from "@/components/dashboard/lab-technician/Sample_collection/Table";
import CollectSampleDialog from "@/components/dashboard/lab-technician/Sample_collection/SampleDialog";


export default function SampleCollectionPage() {


  const searchParams =
    useSearchParams();



  const orderId =
    searchParams.get("orderId");



  const [patients,setPatients] =
    useState<LabPatientOrder[]>(
      initialPatients
    );



  const [openDialog,setOpenDialog] =
    useState(
      Boolean(orderId)
    );



  const [selectedOrderId,setSelectedOrderId] =
    useState<string | null>(
      orderId
    );






  const handleCollectSample =
    (id:string)=>{


      setPatients((prev)=>

        prev.map((patient)=>{


          if(
            patient.order.orderId === id
          )
          {

            return {

              ...patient,

              status:"PROCESSING",

              sample:{

                ...patient.sample,

                sampleId:
                  patient.sample.sampleId ||
                  `SMP-${Date.now()}`,

                barcode:
                  patient.sample.barcode ||
                  `LAB-${Date.now()}`,

                collectedAt:
                  new Date()
                  .toISOString(),

                collectedBy:
                  "Lab Technician",

              },

            };

          }


          return patient;


        })

      );



      setOpenDialog(false);


    };








  return (

    <Box p={3}>


      <SampleCollectionHeader

        onCollectSample={()=>{

          setSelectedOrderId(null);

          setOpenDialog(true);

        }}

      />






      <SampleKPICards

        patients={patients}

      />



    <SampleCollectionTable/>






      <CollectSampleDialog


        open={openDialog}


        orderId={selectedOrderId}


        onClose={()=>{

          setOpenDialog(false);

          setSelectedOrderId(null);

        }}



        onCollectSuccess={
          handleCollectSample
        }


      />



    </Box>

  );

}