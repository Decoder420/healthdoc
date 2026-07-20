"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
import WorkflowStatusAction from "@/components/shared/StatusStepper/WorkflowStatusAction";
import StatusAlert from "@/components/shared/StatusStepper/StatusAlert";

import {
  StatusChangePayload,
  WorkflowAction,
} from "@/components/shared/StatusStepper/types";

import { pathologyWorkflow } from "@/components/dashboard/lab/lab_queue/LabWorkFlow";
import { formatDateTime } from "@/lib/format-datetime";

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

  visit: {
    visitId: string;
    visitType: string;
  };

  doctor: {
    doctorId: string;
    name: string;
    department: string;
  };

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

  onStatusChange: (
    patientId: string,
    payload: StatusChangePayload
  ) => void;

  onWorkflowAction: (
    patientId: string,
    action: WorkflowAction
  ) => void;
}

const priorityColor = {
  emergency: "error",
  urgent: "warning",
  elective: "default",
} as const;

const priorityOrder = {
  emergency: 0,
  urgent: 1,
  elective: 2,
} as const;

export default function PatientQueueTable({
  patients,
  onStatusChange,
  onWorkflowAction,
}: Props) {
  const sortedPatients = [...patients].sort(
    (a, b) => {
      const first =
        priorityOrder[
          a.order.priority
        ] ?? Number.MAX_SAFE_INTEGER;

      const second =
        priorityOrder[
          b.order.priority
        ] ?? Number.MAX_SAFE_INTEGER;

      return first - second;
    }
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        padding:6,
      }}
    >
      <Table>

        <TableHead>
          <TableRow>
            <TableCell align="center">
              Priority
            </TableCell>

            <TableCell>
              Patient
            </TableCell>

            <TableCell>
              UHID
            </TableCell>

            <TableCell>
              Tests
            </TableCell>

            <TableCell>
              Doctor
            </TableCell>

            <TableCell>
              Visit
            </TableCell>

            <TableCell>
              Ordered At
            </TableCell>

            <TableCell align="center">
              Workflow
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedPatients.map(
            (patient) => (
              <TableRow
                key={
                  patient.order.orderId
                }
                hover
              >
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={patient.order.priority.toUpperCase()}
                    color={
                      priorityColor[
                        patient.order
                          .priority
                      ]
                    }
                    sx={{
                      minWidth: 90,
                      fontWeight: 600,
                    }}
                  />
                </TableCell>

                <TableCell>
                  {patient.patient.name}
                </TableCell>

                <TableCell>
                  {patient.patient.uhid}
                </TableCell>

                <TableCell>
                  {patient.requestedTests.join(
                    ", "
                  )}
                </TableCell>

                <TableCell>
                  {patient.doctor.name}
                </TableCell>

                <TableCell>
                  {patient.visit.visitType}
                </TableCell>

                <TableCell>
                  {formatDateTime(patient.order.orderedAt)}
                </TableCell>

                <TableCell align="center">
                  <Stack
  spacing={1}
  sx={{
    alignItems: "center",
    justifyContent: "center",
  }}
>
                    <WorkflowStatusStepper
                      currentStatus={
                        patient.status
                      }
                      workflow={
                        pathologyWorkflow
                      }
                      onStatusChange={(
                        payload
                      ) =>
                        onStatusChange(
                          patient.patient
                            .patientId,
                          payload
                        )
                      }
                    />

                    <WorkflowStatusAction
                      currentStatus={
                        patient.status
                      }
                      workflow={
                        pathologyWorkflow
                      }
                      onAction={(
                        action
                      ) =>
                        onWorkflowAction(
                          patient.patient
                            .patientId,
                          action
                        )
                      }
                    />

                    <StatusAlert
                      status={
                        patient.status
                      }
                      workflow={
                        pathologyWorkflow
                      }
                    />
                  </Stack>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>

      </Table>
    </TableContainer>
  );
}