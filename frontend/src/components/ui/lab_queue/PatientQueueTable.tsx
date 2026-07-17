"use client";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
import WorkflowStatusAction from "@/components/shared/StatusStepper/WorkflowStatusAction";
import StatusAlert from "@/components/shared/StatusStepper/StatusAlert";
import type {
  StatusChangePayload,
  WorkflowAction,
} from "@/components/shared/StatusStepper/types";
import { pathologyWorkflow } from "@/components/ui/lab_queue/LabWorkFlow";
import { meridian } from "@/styles/theme";

export interface PatientData {
  status: string;
  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: string;
    mobile: string;
  };
  visit: { visitId: string; visitType: string };
  doctor: { doctorId: string; name: string; department: string };
  order: {
    orderId: string;
    priority: "emergency" | "urgent" | "elective";
    orderedAt: string;
  };
  sample: {
    sampleId: string;
    barcode: string;
    sampleType: string;
    container: string;
    collectedAt: string;
  };
  requestedTests: string[];
  results: unknown[];
}

interface Props {
  patients: PatientData[];
  onStatusChange: (patientId: string, payload: StatusChangePayload) => void;
  onWorkflowAction: (patientId: string, action: WorkflowAction) => void;
}

const priorityTone = {
  emergency: {
    bg: "#fee2e2",
    fg: meridian.danger,
    border: "rgb(185 28 28 / 0.18)",
  },
  urgent: {
    bg: "#fef3c7",
    fg: meridian.warning,
    border: "rgb(180 83 9 / 0.2)",
  },
  elective: {
    bg: meridian.muted,
    fg: meridian.textSecondary,
    border: meridian.border,
  },
} as const;

const priorityOrder = {
  emergency: 0,
  urgent: 1,
  elective: 2,
} as const;

const headerCellSx = {
  backgroundColor: meridian.muted,
  color: meridian.textSecondary,
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  borderBottom: `1px solid ${meridian.border}`,
  py: 1.5,
};

const bodyCellSx = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: meridian.textPrimary,
  borderBottom: `1px solid rgb(0 31 84 / 0.06)`,
  py: 1.75,
};

export default function PatientQueueTable({
  patients,
  onStatusChange,
  onWorkflowAction,
}: Props) {
  const sortedPatients = [...patients].sort((a, b) => {
    const first = priorityOrder[a.order.priority] ?? Number.MAX_SAFE_INTEGER;
    const second = priorityOrder[b.order.priority] ?? Number.MAX_SAFE_INTEGER;
    return first - second;
  });

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: `1px solid ${meridian.border}`,
        boxShadow:
          "0 1px 2px rgb(0 31 84 / 0.04), 0 12px 32px rgb(0 31 84 / 0.06)",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={headerCellSx}>
              Priority
            </TableCell>
            <TableCell sx={headerCellSx}>Patient</TableCell>
            <TableCell sx={headerCellSx}>UHID</TableCell>
            <TableCell sx={headerCellSx}>Tests</TableCell>
            <TableCell sx={headerCellSx}>Doctor</TableCell>
            <TableCell sx={headerCellSx}>Visit</TableCell>
            <TableCell sx={headerCellSx}>Ordered At</TableCell>
            <TableCell align="center" sx={headerCellSx}>
              Workflow
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedPatients.map((patient) => {
            const tone =
              priorityTone[patient.order.priority] ?? priorityTone.elective;
            return (
              <TableRow
                key={patient.order.orderId}
                hover
                sx={{
                  "&:hover": { backgroundColor: "rgb(0 31 84 / 0.03)" },
                }}
              >
                <TableCell align="center" sx={bodyCellSx}>
                  <Chip
                    size="small"
                    label={patient.order.priority.toUpperCase()}
                    sx={{
                      minWidth: 90,
                      height: 24,
                      borderRadius: "999px",
                      fontWeight: 600,
                      fontSize: "0.6875rem",
                      backgroundColor: tone.bg,
                      color: tone.fg,
                      border: `1px solid ${tone.border}`,
                    }}
                  />
                </TableCell>
                <TableCell sx={bodyCellSx}>{patient.patient.name}</TableCell>
                <TableCell sx={bodyCellSx}>{patient.patient.uhid}</TableCell>
                <TableCell sx={bodyCellSx}>
                  {patient.requestedTests.join(", ")}
                </TableCell>
                <TableCell sx={bodyCellSx}>{patient.doctor.name}</TableCell>
                <TableCell sx={bodyCellSx}>{patient.visit.visitType}</TableCell>
                <TableCell sx={bodyCellSx}>
                  {new Date(patient.order.orderedAt).toLocaleString()}
                </TableCell>
                <TableCell align="center" sx={bodyCellSx}>
                  <Stack spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                    <WorkflowStatusStepper
                      currentStatus={patient.status}
                      workflow={pathologyWorkflow}
                      onStatusChange={(payload) =>
                        onStatusChange(patient.patient.patientId, payload)
                      }
                    />
                    <WorkflowStatusAction
                      currentStatus={patient.status}
                      workflow={pathologyWorkflow}
                      onAction={(action) =>
                        onWorkflowAction(patient.patient.patientId, action)
                      }
                    />
                    <StatusAlert status={patient.status} workflow={pathologyWorkflow} />
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
