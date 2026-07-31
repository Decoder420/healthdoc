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

import { appointmentQueue } from "@/components/dashboard/radiology/test_queue/DummyData";

const today = new Date();

const queuePatients = appointmentQueue
  .filter((patient) => {
    const isToday =
      new Date(patient.appointmentDate).toDateString() === today.toDateString();
    return patient.status === "Queue" && isToday;
  })
  .slice(0, 12);

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
          <Typography variant="h6" fontWeight={700}>
            Appointment Queue
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Patients waiting for imaging today ({queuePatients.length} shown)
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/radiology/queue"
          variant="text"
          endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
          sx={{
            color: "#001F54",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          View Full Queue
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>Token</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Modality</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Procedure</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                <TableCell>
                  <Typography fontWeight={700} color="#001F54">
                    {patient.token}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>
                      {patient.patientName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {patient.age} yrs • {patient.gender}
                    </Typography>
                  </Box>
                </TableCell>

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

                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 180 }}>
                    {patient.procedure}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={500}>
                    {patient.appointmentTime}
                  </Typography>
                </TableCell>

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

                <TableCell>
                  <Chip
                    label={patient.status}
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
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
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
