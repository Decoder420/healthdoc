"use client";

import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";

import type {
  RadiologyTableProps,
} from "./types";


export default function RadiologyTable({

  rows,

  loading = false,

  renderStatus,

  renderActions,

}: RadiologyTableProps) {


  return (

    <Paper

      elevation={0}

      sx={{

        mt:3,

        borderRadius:3,

        border:"1px solid",

        borderColor:"divider",

        overflow:"hidden",

      }}

    >


      <TableContainer>


        <Table>



          {/* HEADER */}

          <TableHead>

            <TableRow>


              <TableCell align="center">
                Patient
              </TableCell>


              <TableCell align="center">
                UHID
              </TableCell>


              <TableCell align="center">
                Accession No.
              </TableCell>


              <TableCell align="center">
                Study
              </TableCell>


              <TableCell align="center">
                Doctor
              </TableCell>


              <TableCell align="center">
                Priority
              </TableCell>


              <TableCell align="center">
                Status
              </TableCell>


              <TableCell align="center">
                Date
              </TableCell>


              <TableCell align="center">
                Actions
              </TableCell>


            </TableRow>

          </TableHead>





          {/* BODY */}

          <TableBody>


            {!loading &&

              rows.map((row)=>(


                <TableRow

                  key={row.id}

                  hover

                >



                  <TableCell align="center">


                    <Stack

                      spacing={0.5}

                      alignItems="center"

                    >

                      <Typography

                        fontWeight={600}

                      >

                        {row.patientName}

                      </Typography>



                      <Typography

                        variant="caption"

                        color="text.secondary"

                      >

                        {row.modality}

                      </Typography>


                    </Stack>


                  </TableCell>





                  <TableCell align="center">

                    {row.uhid}

                  </TableCell>





                  <TableCell align="center">

                    {row.accessionNo}

                  </TableCell>





                  <TableCell align="center">

                    {row.study}

                  </TableCell>





                  <TableCell align="center">

                    {row.doctor}

                  </TableCell>





                  <TableCell align="center">


                    <Chip

                      size="small"

                      label={row.priority}

                      color={

                        row.priority === "STAT"

                        ? "error"

                        :

                        row.priority === "Urgent"

                        ? "warning"

                        :

                        "default"

                      }

                    />


                  </TableCell>







                  <TableCell align="center">

                    {

                      renderStatus

                      ?

                      renderStatus(row)

                      :

                      row.status

                    }


                  </TableCell>







                  <TableCell align="center">

                    {row.studyDate}

                  </TableCell>







                  <TableCell align="center">


                    {

                      renderActions

                      ?

                      renderActions(row)

                      :

                      "-"

                    }


                  </TableCell>





                </TableRow>


              ))

            }








            {!loading && rows.length === 0 && (


              <TableRow>


                <TableCell

                  colSpan={9}

                  align="center"

                >

                  <Typography

                    py={5}

                    color="text.secondary"

                  >

                    No studies found.

                  </Typography>


                </TableCell>


              </TableRow>


            )}



          </TableBody>


        </Table>


      </TableContainer>


    </Paper>


  );

}