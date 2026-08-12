"use client";

import Link from "next/link";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  appointmentQueue,
} from "@/components/dashboard/radiology/test_queue/DummyData";

const today = new Date();

const queuePatients = appointmentQueue
  .filter((patient) => {
    const appointmentDate = new Date(patient.appointmentDate);

    const isToday =
      appointmentDate.toDateString() === today.toDateString();

    return (
      [
        "Queue",
        "Scan Started",
        "No Show",
      ].includes(patient.status) &&
      isToday
    );
  })
  .slice(0, 12);

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Emergency":
      return {
        bgcolor: "action.hover",
        color: "error.main",
      };

    case "Urgent":
      return {
        bgcolor: "action.hover",
        color: "warning.main",
      };

    default:
      return {
        bgcolor: "action.hover",
        color: "text.secondary",
      };
  }
}

export default function AppointmentQueueTable() {
  return (
    <div className="surface-card overflow-hidden">
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
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
          >
            Appointment Queue
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Patients waiting for imaging today ({queuePatients.length} shown)
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
            color: "primary.main",
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          View Full Queue
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "action.hover",
              }}
            >
              {[
                "Accession No.",
                "Patient",
                "Modality",
                "Procedure",
                "Time",
                "Priority",
                "Status",
              ].map((head) => (
                <TableCell
                  key={head}
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {queuePatients.map((patient) => (
              <TableRow
                key={patient.id}
                hover
              >
                {/* Accession */}
                <TableCell align="center">
                  <Typography
                    fontWeight={600}
                    color="primary.main"
                  >
                    {patient.accessionNumber}
                  </Typography>
                </TableCell>

                {/* Patient */}
                <TableCell align="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
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
                <TableCell align="center">
                  <Chip
                    label={patient.modality}
                    size="small"
                    sx={{
                      bgcolor: "action.hover",
                      color: "text.primary",
                      fontWeight: 600,
                      borderRadius: 2,
                      minWidth: 70,
                    }}
                  />
                </TableCell>

                {/* Procedure */}
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 180,
                      margin: "auto",
                    }}
                  >
                    {patient.procedure}
                  </Typography>
                </TableCell>

                {/* Time */}
                <TableCell align="center">
                  <Typography
                    fontWeight={500}
                    fontSize={14}
                  >
                    {patient.appointmentTime}
                  </Typography>
                </TableCell>

                {/* Priority */}
                <TableCell align="center">
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
                <TableCell align="center">
                  <Chip
                    label={
                      patient.status === "Processing"
                        ? "Processing"
                        : patient.status
                    }
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      minWidth: 90,
                      color: "text.secondary",
                      borderColor: "divider",
                      bgcolor: "transparent",
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
                    No patients are currently waiting.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
