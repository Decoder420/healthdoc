"use client";

import Link from "next/link";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const appointmentQueue= [
  {
  id: 1,
  token: "RAD001",
  patientName: "Rahul Sharma",
  uhid: "UH100245",
  age: 36,
  gender: "Male",
  modality: "CT",
  procedure: "CT Brain",
  radiologist: "Dr. Mehta",
  appointmentDate: "2026-07-23",
  appointmentTime: "09:30 AM",
  priority: "Emergency",
  status: "Queue",
},
{
  id: 2,
  token: "RAD002",
  patientName: "Priya Singh",
  uhid: "UH100312",
  age: 42,
  gender: "Female",
  modality: "MRI",
  procedure: "MRI Spine",
  radiologist: "Dr. Sharma",
  appointmentDate: "2026-07-23",
  appointmentTime: "09:45 AM",
  priority: "Urgent",
  status: "Queue",
},
{
  id: 3,
  token: "RAD003",
  patientName: "Amit Verma",
  uhid: "UH100489",
  age: 51,
  gender: "Male",
  modality: "X-Ray",
  procedure: "Chest PA View",
  radiologist: "Dr. Gupta",
  appointmentDate: "2026-07-23",
  appointmentTime: "10:00 AM",
  priority: "Routine",
  status: "Queue",
},
{
  id: 4,
  token: "RAD004",
  patientName: "Sneha Kapoor",
  uhid: "UH100521",
  age: 28,
  gender: "Female",
  modality: "Ultrasound",
  procedure: "Whole Abdomen",
  radiologist: "Dr. Nair",
  appointmentDate: "2026-07-23",
  appointmentTime: "10:20 AM",
  priority: "Routine",
  status: "Queue",
},
{
  id: 5,
  token: "RAD005",
  patientName: "Vikram Joshi",
  uhid: "UH100588",
  age: 61,
  gender: "Male",
  modality: "CT",
  procedure: "CT Chest",
  radiologist: "Dr. Mehta",
  appointmentDate: "2026-07-23",
  appointmentTime: "10:35 AM",
  priority: "Urgent",
  status: "Queue",
},
{
  id: 6,
  token: "RAD006",
  patientName: "Anjali Patel",
  uhid: "UH100604",
  age: 34,
  gender: "Female",
  modality: "MRI",
  procedure: "MRI Knee",
  radiologist: "Dr. Sharma",
  appointmentDate: "2026-07-23",
  appointmentTime: "10:50 AM",
  priority: "Routine",
  status: "Queue",
},
{
  id: 7,
  token: "RAD007",
  patientName: "Rohit Malhotra",
  uhid: "UH100622",
  age: 47,
  gender: "Male",
  modality: "X-Ray",
  procedure: "Lumbar Spine AP/LAT",
  radiologist: "Dr. Gupta",
  appointmentDate: "2026-07-23",
  appointmentTime: "11:05 AM",
  priority: "Routine",
  status: "Queue",
},
{
  id: 8,
  token: "RAD008",
  patientName: "Neha Arora",
  uhid: "UH100645",
  age: 39,
  gender: "Female",
  modality: "Mammography",
  procedure: "Screening Mammography",
  radiologist: "Dr. Kapoor",
  appointmentDate: "2026-07-23",
  appointmentTime: "11:20 AM",
  priority: "Routine",
  status: "Completed",
},
{
  id: 9,
  token: "RAD009",
  patientName: "Arjun Kumar",
  uhid: "UH100667",
  age: 54,
  gender: "Male",
  modality: "CT",
  procedure: "CT Abdomen",
  radiologist: "Dr. Mehta",
  appointmentDate: "2026-07-23",
  appointmentTime: "11:40 AM",
  priority: "Emergency",
  status: "In Progress",
},
{
  id: 10,
  token: "RAD010",
  patientName: "Pooja Sharma",
  uhid: "UH100690",
  age: 31,
  gender: "Female",
  modality: "Ultrasound",
  procedure: "Pelvis Scan",
  radiologist: "Dr. Nair",
  appointmentDate: "2026-07-23",
  appointmentTime: "12:00 PM",
  priority: "Routine",
  status: "Scheduled",
},
];



const today = new Date();

const queuePatients = appointmentQueue
  .filter((patient) => {
    return (
      patient.status === "Queue" &&
      new Date(patient.appointmentDate).toDateString() ===
        today.toDateString()
    );
  })
  .slice(0, 7);

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Emergency":
      return {
        bgcolor: "#FEECEC",
        color: "#D32F2F",
      };

    case "Urgent":
      return {
        bgcolor: "#FFF4E5",
        color: "#ED6C02",
      };

    default:
      return {
        bgcolor: "#EEF4FF",
        color: "#001F54",
      };
  }
}

export default function AppointmentQueueTable() {
  return (
   <Paper
  elevation={0}
  sx={{
    borderRadius: 4,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
  }}
>
  {/* Header */}
  <Box
    sx={{
      px: 3,
      py: 2.5,
      borderBottom: "1px solid",
      borderColor: "divider",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box>
      <Typography
        variant="h6"
        fontWeight={700}
      >
        Appointment Queue
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Top 7 patients waiting for imaging
      </Typography>
    </Box>

    <Button
      component={Link}
      href="/radiology/queue"
      variant="text"
      endIcon={
        <ArrowForwardIosRoundedIcon
          sx={{ fontSize: 14 }}
        />
      }
      sx={{
        color: "#001F54",
        textTransform: "none",
        fontWeight: 600,
      }}
    >
      View Full Queue
    </Button>
  </Box>

  {/* Table */}
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow
          sx={{
            bgcolor: "grey.50",
          }}
        >
          <TableCell sx={{ fontWeight: 700 }}>
            Token
          </TableCell>

          <TableCell sx={{ fontWeight: 700 }}>
            Patient
          </TableCell>

          <TableCell sx={{ fontWeight: 700 }}>
            Modality
          </TableCell>

          <TableCell sx={{ fontWeight: 700 }}>
            Procedure
          </TableCell>

          <TableCell sx={{ fontWeight: 700 }}>
            Time
          </TableCell>

          <TableCell sx={{ fontWeight: 700 }}>
            Priority
          </TableCell>

          <TableCell sx={{ fontWeight: 700 }}>
            Status
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {queuePatients.map((patient) => (
          <TableRow
            key={patient.id}
            hover
            sx={{
              "&:last-child td": {
                borderBottom: 0,
              },
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {/* Token */}
            <TableCell>
              <Typography
                fontWeight={700}
                color="#001F54"
              >
                {patient.token}
              </Typography>
            </TableCell>

            {/* Patient */}
            <TableCell>
              <Box>
                <Typography
                  fontWeight={600}
                  fontSize={14}
                >
                  {patient.patientName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {patient.age} yrs • {patient.gender}
                </Typography>
              </Box>
            </TableCell>

            {/* Modality */}
            <TableCell>
              <Chip
                label={patient.modality}
                size="small"
                sx={{
                  bgcolor: "#EEF4FF",
                  color: "#001F54",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                }}
              />
            </TableCell>

            {/* Procedure */}
            <TableCell>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: 180,
                }}
              >
                {patient.procedure}
              </Typography>
            </TableCell>

            {/* Time */}
            <TableCell>
              <Typography fontWeight={500}>
                {patient.appointmentTime}
              </Typography>
            </TableCell>

            {/* Priority */}
            <TableCell>
              <Chip
                label={patient.priority}
                size="small"
                sx={{
                  ...getPriorityStyle(patient.priority),
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 80,
                }}
              />
            </TableCell>

            {/* Status */}
            <TableCell>
              <Chip
                label="Queue"
                size="small"
                sx={{
                  bgcolor: "#EEF4FF",
                  color: "#001F54",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                }}
              />
            </TableCell>
          </TableRow>
        ))}

        {queuePatients.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              align="center"
              sx={{ py: 6 }}
            >
              <Typography color="text.secondary">
                No patients are currently waiting in the queue.
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