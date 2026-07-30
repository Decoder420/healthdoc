"use client";

import {
  Box,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";


export interface SampleInformationData {
  sampleType: string;
  container: string;
  priority: string;
  collectionDate: string;
  collectionTime: string;
  collectedBy: string;
}


interface SampleInformationProps {
  value: SampleInformationData;
  onChange: (
    value: SampleInformationData
  ) => void;
}


export default function SampleInformation({
  value,
  onChange,
}: SampleInformationProps) {


  const [currentDate, setCurrentDate] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState("");



  useEffect(() => {

    const updateDateTime = () => {

      const now = new Date();


      setCurrentDate(
        now.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      );


      setCurrentTime(
        now.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        )
      );



      // store automatically in parent state
      onChange({
        ...value,
        collectionDate:
          now.toISOString().split("T")[0],

        collectionTime:
          now.toTimeString().slice(0,5),
      });

    };


    updateDateTime();


    const timer =
      setInterval(
        updateDateTime,
        1000
      );


    return () =>
      clearInterval(timer);


  }, []);





  const handleChange =
    (
      field: keyof SampleInformationData
    ) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement
      >
    ) => {

      onChange({

        ...value,

        [field]:
          event.target.value,

      });

    };




  return (

    <Paper

      variant="outlined"

      sx={{

        p:3,

        borderRadius:3,

      }}

    >


      <Typography

        variant="h6"

        fontWeight={600}

        mb={3}

      >

        Sample Information

      </Typography>





      <Box

        sx={{

          display:"grid",

          gridTemplateColumns:{

            xs:"1fr",

            md:"repeat(2,1fr)",

          },

          gap:2,

        }}

      >





        <TextField

          select

          label="Sample Type"

          value={
            value.sampleType
          }

          onChange={
            handleChange(
              "sampleType"
            )
          }

          fullWidth

        >

          <MenuItem value="Blood">
            Blood
          </MenuItem>

          <MenuItem value="Urine">
            Urine
          </MenuItem>

          <MenuItem value="Stool">
            Stool
          </MenuItem>

          <MenuItem value="Serum">
            Serum
          </MenuItem>

          <MenuItem value="Plasma">
            Plasma
          </MenuItem>


        </TextField>






        <TextField

          select

          label="Container"

          value={
            value.container
          }

          onChange={
            handleChange(
              "container"
            )
          }

          fullWidth

        >

          <MenuItem value="EDTA Tube">
            EDTA Tube
          </MenuItem>

          <MenuItem value="Plain Tube">
            Plain Tube
          </MenuItem>

          <MenuItem value="Fluoride Tube">
            Fluoride Tube
          </MenuItem>

          <MenuItem value="Citrate Tube">
            Citrate Tube
          </MenuItem>


        </TextField>






        <TextField

          select

          label="Priority"

          value={
            value.priority
          }

          onChange={
            handleChange(
              "priority"
            )
          }

          fullWidth

        >

          <MenuItem value="Routine">
            Routine
          </MenuItem>

          <MenuItem value="Urgent">
            Urgent
          </MenuItem>

          <MenuItem value="STAT">
            STAT
          </MenuItem>


        </TextField>






        {/* Automatic Date */}

        <TextField

          label="Collection Date"

          value={currentDate}

          InputProps={{
            readOnly:true,
          }}

          fullWidth

        />





        {/* Automatic Time */}

        <TextField

          label="Collection Time"

          value={currentTime}

          InputProps={{
            readOnly:true,
          }}

          fullWidth

        />






        <TextField

          label="Collected By"

          value={
            value.collectedBy
          }

          onChange={
            handleChange(
              "collectedBy"
            )
          }

          fullWidth

        />


      </Box>


    </Paper>


  );

}