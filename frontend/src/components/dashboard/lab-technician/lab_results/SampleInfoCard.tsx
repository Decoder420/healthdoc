"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  ChipProps,
} from "@mui/material";

import Barcode from "react-barcode";

import { LabPatientOrder } from "@/lib/mock/lab_data";


interface Props {
  sample: LabPatientOrder["sample"];
  status: LabPatientOrder["status"];
}


function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {

  return (
    <Box
      sx={{
        minWidth:170,
      }}
    >

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>


      <Typography
        variant="body1"
        fontWeight={600}
      >
        {value || "--"}
      </Typography>

    </Box>
  );
}



const statusColor = (
  status: string
): ChipProps["color"] => {

  switch(status){

    case "COLLECTED":
      return "success";

    case "QUEUE":
      return "warning";

    case "REJECTED":
      return "error";

    case "PROCESSING":
      return "info";

    case "VERIFIED":
      return "success";

    case "COMPLETED":
      return "success";

    default:
      return "default";

  }

};



export default function SampleInfoCard({
  sample,
  status,
}: Props) {


  return (

    <Card
      sx={{
        mt:3,
        borderRadius:3,
      }}
    >

      <CardContent>


        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Sample Information
        </Typography>



        <Box
          sx={{
            display:"grid",
            gridTemplateColumns:{
              xs:"1fr",
              lg:"1fr auto",
            },
            alignItems:"center",
          }}
        >


          {/* Sample Details */}

          <Box
            sx={{
              display:"grid",
              gridTemplateColumns:{
                xs:"1fr",
                sm:"repeat(2,1fr)",
                md:"repeat(4,1fr)",
              },
              gap:3,
            }}
          >

            <InfoItem
              label="Sample ID"
              value={sample.sampleId}
            />


            <InfoItem
              label="Barcode"
              value={sample.barcode}
            />


            <InfoItem
              label="Sample Type"
              value={sample.sampleType}
            />


            <InfoItem
              label="Container"
              value={sample.container}
            />


            <InfoItem
              label="Collected At"
              value={
                sample.collectedAt
                  ? new Date(
                      sample.collectedAt
                    ).toLocaleString()
                  : "--"
              }
            />


            <InfoItem
              label="Collected By"
              value={sample.collectedBy}
            />

          </Box>



          {/* Barcode Section */}

          <Stack
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            sx={{
              minWidth:220,
            }}
          >


            <Chip
              label={status}
              color={statusColor(status)}
              size="small"
            />



            {
              sample.barcode && (

                <Barcode
                  value={sample.barcode}
                  width={1.6}
                  height={45}
                  displayValue={false}
                  margin={0}
                />

              )
            }



            <Typography
              variant="caption"
              color="text.secondary"
            >
              {sample.barcode || "--"}
            </Typography>


          </Stack>


        </Box>



        <Divider
          sx={{
            mt:3,
          }}
        />


      </CardContent>

    </Card>

  );
}