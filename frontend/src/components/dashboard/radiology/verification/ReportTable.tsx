"use client";

import { useRouter } from "next/navigation";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  
  Typography,
} from "@mui/material";

import type {
  RadiologyReportPatient,
} from "@/components/dashboard/radiology/test_result/types";


interface Props {
  reports: RadiologyReportPatient[];
}


export default function VerifiedReportsTable({
  reports,
}: Props) {


  const router = useRouter();



  const handleOpenReport = (
    report: RadiologyReportPatient
  ) => {

    router.push(
      `/radiology/reports/${report.id}`
    );

  };



  const verifiedReports =
    reports.filter(
      (item) =>
        item.studyStatus === "Verified"
    );



  return (

    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
      }}
    >

      <Table>


        <TableHead>

          <TableRow>

            <TableCell>
              Accession No
            </TableCell>

            <TableCell>
              Patient
            </TableCell>

            <TableCell>
              UHID
            </TableCell>

            <TableCell>
              Modality
            </TableCell>

            <TableCell>
              Procedure
            </TableCell>

            <TableCell>
              Radiologist
            </TableCell>

            <TableCell>
              Appointment
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell align="center">
              Report
            </TableCell>

          </TableRow>

        </TableHead>



        <TableBody>


          {verifiedReports.length > 0 ? (

            verifiedReports.map((item)=>(

              <TableRow
                hover
                key={item.id}
              >


                <TableCell>
                  {item.accessionNumber}
                </TableCell>



                <TableCell>

                  <Stack spacing={0.5}>

                    <Typography
                      fontWeight={600}
                    >
                      {item.patientName}
                    </Typography>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {item.age} Years • {item.gender}
                    </Typography>


                  </Stack>

                </TableCell>



                <TableCell>
                  {item.uhid}
                </TableCell>



                <TableCell>
                  {item.modality}
                </TableCell>



                <TableCell>
                  {item.procedure}
                </TableCell>



                <TableCell>
                  {item.radiologist}
                </TableCell>



                <TableCell>

                  <Stack>

                    <Typography variant="body2">
                      {item.appointmentDate}
                    </Typography>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {item.appointmentTime}
                    </Typography>


                  </Stack>

                </TableCell>



                <TableCell>

                  <Chip
                    label={item.studyStatus}
                    color="success"
                    size="small"
                  />

                </TableCell>



                <TableCell align="center">

                  <Tooltip
                    title="View Report"
                  >

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleOpenReport(item)
                      }
                    >

                      <PictureAsPdfIcon />

                    </IconButton>


                  </Tooltip>


                </TableCell>


              </TableRow>

            ))

          ) : (

            <TableRow>

              <TableCell
                colSpan={9}
                align="center"
                sx={{
                  py: 6,
                }}
              >

                <Typography
                  color="text.secondary"
                >
                  No verified reports found.
                </Typography>


              </TableCell>


            </TableRow>

          )}


        </TableBody>


      </Table>


    </TableContainer>

  );
}