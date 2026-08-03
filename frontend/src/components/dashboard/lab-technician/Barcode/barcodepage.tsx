"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import BarcodeDisplay from "@/components/shared/BarcodeDisplay";

import {
  getLabBarcodeSamples,
} from "@/lib/mock/lab_data";


export default function BarcodePage() {


  const samples = useMemo(
    () => getLabBarcodeSamples(1000),
    []
  );


  const [search,setSearch] =
    useState("");


  const [value,setValue] =
    useState(
      samples[0]?.barcode ??
      "LAB-2026-0018"
    );


  const printRef =
    useRef<HTMLDivElement>(null);



  const selectedSample =
    samples.find(
      (item)=>
        item.barcode === value
    );





  const filteredSamples =
    samples
      .filter((sample)=>{

        const keyword =
          search
          .toLowerCase()
          .trim();


        if(!keyword)
          return true;


        return (

          sample.barcode
          .toLowerCase()
          .includes(keyword)

          ||

          sample.orderId
          .toLowerCase()
          .includes(keyword)

          ||

          sample.patientName
          .toLowerCase()
          .includes(keyword)

          ||

          sample.uhid
          .toLowerCase()
          .includes(keyword)

        );

      })
      .slice(0,10);






  const handlePrint =
    useReactToPrint({

      contentRef: printRef,


      documentTitle:
        selectedSample
        ? `${selectedSample.barcode}-barcode`
        : "Lab Barcode",



      pageStyle:`

        @page {
          size: 80mm auto;
          margin:5mm;
        }


        body {

          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;

        }



        @media print {


          body * {

            visibility:hidden;

          }



          #barcode-print-area,
          #barcode-print-area * {

            visibility:visible;

          }



          #barcode-print-area {

            position:absolute;

            top:0;

            left:0;

            width:100%;

          }



          svg,
          canvas {

            display:block !important;

            visibility:visible !important;

          }


        }

      `,

    });





  const printBarcode = ()=>{

    setTimeout(()=>{

      handlePrint();

    },500);

  };






  return (

    <Box

      component="main"

      sx={{

        maxWidth:900,

        mx:"auto",

        px:3,

        py:4,

      }}

    >



      <Box mb={3}>

        <Link

          href="/lab/dashboard"

          style={{
            textDecoration:"none",
          }}

        >

          <Button

            variant="outlined"

          >

            ← Back to Lab Dashboard

          </Button>


        </Link>


      </Box>






      <Typography

        variant="h4"

        fontWeight={700}

        mb={1}

      >

        Barcode Generator

      </Typography>






      <Typography

        color="text.secondary"

        mb={4}

      >

        Search all laboratory samples and print barcode labels.

      </Typography>







      <Stack spacing={3}>


        <TextField

          size="small"

          fullWidth

          label="Search Barcode / Order ID / Patient / UHID"

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

        />





        <TextField

          size="small"

          fullWidth

          label="Barcode Value"

          value={value}

          onChange={(e)=>
            setValue(e.target.value)
          }

        />







        {/* PRINT AREA */}

        <Paper

          id="barcode-print-area"

          ref={printRef}

          elevation={3}

          sx={{

            p:4,

            borderRadius:3,

          }}

        >


          <Stack

            spacing={2}

            alignItems="center"

          >



            <BarcodeDisplay

              value={value}

            />





            {
              selectedSample &&

              <Box textAlign="center">


                <Typography

                  fontWeight={700}

                >

                  {selectedSample.patientName}

                </Typography>




                <Typography variant="body2">

                  UHID: {selectedSample.uhid}

                </Typography>




                <Typography variant="body2">

                  Order ID: {selectedSample.orderId}

                </Typography>




                <Typography variant="body2">

                  Barcode: {selectedSample.barcode}

                </Typography>



              </Box>

            }



          </Stack>


        </Paper>







        <Button

          variant="contained"

          disabled={!value}

          onClick={printBarcode}

        >

          Print Barcode

        </Button>









        <Paper

          elevation={2}

          sx={{

            p:3,

            borderRadius:3,

          }}

        >


          <Typography

            fontWeight={700}

            mb={2}

          >

            Sample Barcodes ({filteredSamples.length}/10)

          </Typography>





          <Stack spacing={1}>


            {
              filteredSamples.length > 0

              ?

              filteredSamples.map((sample)=>(

                <Button

                  key={sample.barcode}

                  variant={
                    value===sample.barcode
                    ? "contained"
                    : "outlined"
                  }


                  onClick={()=>
                    setValue(sample.barcode)
                  }


                  sx={{

                    justifyContent:"flex-start",

                    textTransform:"none",

                  }}

                >

                  <Box textAlign="left">


                    <Typography>

                      {sample.barcode}

                    </Typography>



                    <Typography

                      variant="caption"

                    >

                      {sample.patientName}

                      {" · "}

                      {sample.uhid}

                      {" · "}

                      {sample.orderId}


                    </Typography>


                  </Box>


                </Button>


              ))

              :

              <Typography color="text.secondary">

                No barcode found.

              </Typography>

            }


          </Stack>


        </Paper>


      </Stack>


    </Box>

  );

}