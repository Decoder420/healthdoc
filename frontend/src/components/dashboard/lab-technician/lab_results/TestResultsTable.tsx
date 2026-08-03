"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
  Box,
  Button,
  ChipProps,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { LabPatientOrder } from "@/lib/mock/lab_data";


type LabResult =
  LabPatientOrder["results"][number];


interface Props {
  tests: LabResult[];

  onChange: (
    index: number,
    field: keyof LabResult,
    value: string
  ) => void;

  onAddRow: () => void;
}



function getFlag(
  result: string,
  referenceRange: string
): {
  label: string;
  color: ChipProps["color"];
} {

  const value = Number(result);


  if (isNaN(value)) {
    return {
      label: "-",
      color: "default",
    };
  }


  const range =
    referenceRange.trim();



  // Example: 3.5-5.5
  if (range.includes("-")) {

    const [min, max] =
      range
        .split("-")
        .map((v) =>
          Number(v.trim())
        );


    if (
      !isNaN(min) &&
      !isNaN(max)
    ) {

      if (value < min) {

        return {
          label: "Low",
          color: "warning",
        };

      }


      if (value > max) {

        return {
          label: "High",
          color: "error",
        };

      }


      return {
        label: "Normal",
        color: "success",
      };

    }

  }



  // Example: <5

  if (range.startsWith("<")) {

    const max =
      Number(
        range.replace("<", "")
      );


    if (!isNaN(max)) {

      return value < max
        ? {
            label: "Normal",
            color: "success",
          }
        : {
            label: "High",
            color: "error",
          };

    }

  }



  // Example: >10

  if (range.startsWith(">")) {

    const min =
      Number(
        range.replace(">", "")
      );


    if (!isNaN(min)) {

      return value > min
        ? {
            label: "Normal",
            color: "success",
          }
        : {
            label: "Low",
            color: "warning",
          };

    }

  }



  return {
    label: "-",
    color: "default",
  };

}




export default function TestResultsTable({
  tests,
  onChange,
  onAddRow,
}: Props) {


  return (

    <TableContainer

      component={Paper}

      sx={{
        mt: 3,
        pb: 2,
        borderRadius: 3,
        overflowX: "auto",
      }}

    >


      <Box

        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}

      >

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Test Results
        </Typography>



        <Button

          variant="contained"

          size="small"

          startIcon={
            <AddRoundedIcon />
          }

          onClick={onAddRow}

          sx={{
            borderRadius: 2,
            textTransform: "none",
          }}

        >
          Add Row

        </Button>


      </Box>




      <Table
        stickyHeader
        size="small"
      >


        <TableHead>

          <TableRow>


            <TableCell
              sx={{
                fontWeight: 600,
              }}
            >
              Test
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 600,
              }}
            >
              Result
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 600,
              }}
            >
              Unit
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 600,
              }}
            >
              Reference Range
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 600,
              }}
            >
              Flag
            </TableCell>


            <TableCell
              sx={{
                fontWeight: 600,
              }}
            >
              Remarks
            </TableCell>


          </TableRow>


        </TableHead>




        <TableBody>


          {tests.map((test, index) => {


            const flag =
              getFlag(
                test.result,
                test.referenceRange
              );


            const abnormal =
              flag.label === "High" ||
              flag.label === "Low";



            return (

              <TableRow

                hover

                key={test.id}

              >


                <TableCell>

                  <TextField

                    fullWidth

                    size="small"

                    value={
                      test.testName
                    }

                    onChange={(e) =>
                      onChange(
                        index,
                        "testName",
                        e.target.value
                      )
                    }

                  />

                </TableCell>




                <TableCell>

                  <TextField

                    fullWidth

                    size="small"

                    value={
                      test.result
                    }

                    error={
                      abnormal
                    }

                    onChange={(e) =>
                      onChange(
                        index,
                        "result",
                        e.target.value
                      )
                    }

                  />

                </TableCell>




                <TableCell>

                  <TextField

                    fullWidth

                    size="small"

                    value={
                      test.unit
                    }

                    onChange={(e) =>
                      onChange(
                        index,
                        "unit",
                        e.target.value
                      )
                    }

                  />

                </TableCell>




                <TableCell>

                  <TextField

                    fullWidth

                    size="small"

                    value={
                      test.referenceRange
                    }

                    onChange={(e) =>
                      onChange(
                        index,
                        "referenceRange",
                        e.target.value
                      )
                    }

                  />

                </TableCell>




                <TableCell>

                  <TextField

                    select

                    fullWidth

                    size="small"

                    value={
                      test.flag
                    }

                    onChange={(e) =>
                      onChange(
                        index,
                        "flag",
                        e.target.value
                      )
                    }

                  >

                    <MenuItem value="-">
                      -
                    </MenuItem>


                    <MenuItem value="Normal">
                      Normal
                    </MenuItem>


                    <MenuItem value="High">
                      High
                    </MenuItem>


                    <MenuItem value="Low">
                      Low
                    </MenuItem>


                  </TextField>


                </TableCell>




                <TableCell>

                  <TextField

                    fullWidth

                    size="small"

                    value={
                      test.remarks
                    }

                    onChange={(e) =>
                      onChange(
                        index,
                        "remarks",
                        e.target.value
                      )
                    }

                  />

                </TableCell>



              </TableRow>

            );

          })}


        </TableBody>


      </Table>


    </TableContainer>

  );

}