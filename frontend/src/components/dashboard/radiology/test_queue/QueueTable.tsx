"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import WorkflowStatusStepper from "@/components/shared/StatusStepper/WorkflowStatusStepper";
import WorkflowStatusAction from "@/components/shared/StatusStepper/WorkflowStatusAction";
import StatusAlert from "@/components/shared/StatusStepper/StatusAlert";

import {
  StatusStep,
  WorkflowAction,
} from "@/components/shared/StatusStepper/types";

import { appointmentQueue } from "./DummyData";


interface Props {
  search: string;
  modality: string;
  priority: string;
  status: string;
}


export interface QueuePatient {
  id: number;
  token: string;
  patientName: string;
  uhid: string;
  age: number;
  gender: string;
  modality: string;
  procedure: string;
  radiologist: string;
  appointmentDate: string;
  appointmentTime: string;
  priority: string;
  status: string;
}


const priorityOrder: Record<string, number> = {
  Emergency: 1,
  Urgent: 2,
  Routine: 3,
};


/* ======================================================
   RADIOLOGY WORKFLOW
====================================================== */

const RADIOLOGY_QUEUE_WORKFLOW: StatusStep[] = [
  {
    value: "Queue",
    label: "Queue",

    actions: [
      {
        id: "START_SCAN",
        label: "Start Scan",
        nextStatus: "Scan Started",
        variant: "contained",
        color: "primary",
      },

      {
        id: "NO_SHOW",
        label: "No Show",
        nextStatus: "No Show",
        variant: "contained",
        color: "primary",
        requiresConfirmation: true,
      },

      {
        id: "REMOVE",
        label: "Remove",
        nextStatus: "Removed",
        variant: "contained",
        color: "primary",
        requiresConfirmation: true,
      },
    ],
  },


  {
    value: "Scan Started",
    label: "Scanning",

    actions: [
      {
        id: "COMPLETE_SCAN",
        label: "Complete",
        nextStatus: "Completed",
        variant: "contained",
        color: "primary",
      },

      {
        id: "REMOVE",
        label: "Remove",
        nextStatus: "Removed",
        variant: "contained",
        color: "primary",
      },
    ],
  },


  {
    value: "Completed",
    label: "Completed",
    terminal: true,
  },


  {
    value: "No Show",
    label: "No Show",

    alert: {
      severity: "warning",
      message:
        "Patient did not arrive for scheduled scan",
    },

    actions: [
      {
        id: "RESCHEDULE",
        label: "Reschedule",
        nextStatus: "Queue",
        variant: "contained",
        color: "primary",
      },

      {
        id: "REMOVE",
        label: "Remove",
        nextStatus: "Removed",
        variant: "contained",
        color: "primary",
      },
    ],
  },


  {
    value: "Removed",
    label: "Removed",

    alert: {
      severity: "error",
      message:
        "Appointment removed from queue",
    },

    terminal: true,
  },
];


export default function QueueTable({
  search,
  modality,
  priority,
  status,
}: Props) {


  const [rows,setRows] =
    useState<QueuePatient[]>(
      appointmentQueue
    );



  /* ===============================
     FILTER
  =============================== */

  const filteredRows = useMemo(()=>{

    return rows
      .filter((patient)=>{

        const keyword =
          search
          .trim()
          .toLowerCase();


        const matchesSearch =
          patient.patientName
          .toLowerCase()
          .includes(keyword)

          ||

          patient.uhid
          .toLowerCase()
          .includes(keyword)

          ||

          patient.token
          .toLowerCase()
          .includes(keyword);



        const matchesModality =
          modality==="All"
          ||
          patient.modality===modality;



        const matchesPriority =
          priority==="All"
          ||
          patient.priority===priority;



        const matchesStatus =
          status==="All"
          ||
          patient.status===status;



        return (
          matchesSearch &&
          matchesModality &&
          matchesPriority &&
          matchesStatus
        );

      })


      .sort(
        (a,b)=>
          priorityOrder[a.priority]
          -
          priorityOrder[b.priority]
      );


  },[
    rows,
    search,
    modality,
    priority,
    status
  ]);




  /* ===============================
     ACTION HANDLER
  =============================== */


  function handleWorkflowAction(
    patientId:number,
    action:WorkflowAction
  ){

    setRows(prev=>
      prev.map(row=>{

        if(row.id!==patientId)
          return row;


        return {
          ...row,
          status:action.nextStatus
        };

      })
    );

  }




  return (

    <Paper
      elevation={0}
      sx={{
        borderRadius:3,
        border:"1px solid",
        borderColor:"divider",
        overflow:"hidden",
      }}
    >


      <TableContainer
        sx={{
          maxHeight:720
        }}
      >


       <Table
  stickyHeader
  size="small"
  sx={{
    "& th": {
      textAlign: "center",
      fontWeight: 700,
      whiteSpace: "nowrap",
    },

    "& td": {
      textAlign: "center",
      verticalAlign: "middle",
    },
  }}
>


<TableHead>

<TableRow>

{
[
"Token",
"Patient",
"UHID",
"Modality",
"Procedure",
"Time",
"Priority",
"Status",
"Actions"
]
.map((head)=>(
<TableCell
key={head}
sx={{
fontWeight:700
}}
>
{head}
</TableCell>
))
}

</TableRow>

</TableHead>



<TableBody>


{
filteredRows.map((patient)=>(

<TableRow
key={patient.id}
hover
sx={{
"& td":{
py:1
}
}}
>


<TableCell>

<Typography
fontWeight={700}
color="primary"
>
{patient.token}
</Typography>

</TableCell>



<TableCell>

<Stack spacing={0.2}>

<Typography
fontWeight={600}
>
{patient.patientName}
</Typography>


<Typography
variant="caption"
color="text.secondary"
>
{patient.age} yrs • {patient.gender}
</Typography>

</Stack>

</TableCell>




<TableCell>
{patient.uhid}
</TableCell>



<TableCell>

<Chip
label={patient.modality}
size="small"
variant="outlined"
/>

</TableCell>



<TableCell>
{patient.procedure}
</TableCell>



<TableCell>
{patient.appointmentTime}
</TableCell>




<TableCell>

<Chip
label={patient.priority}
size="small"
variant="outlined"
/>

</TableCell>


<TableCell
  align="center"
  sx={{
    minWidth: 180,
  }}
>
  <Stack
    direction="column"
    alignItems="center"
    justifyContent="center"
    spacing={1}
  >
    <WorkflowStatusStepper
      currentStatus={patient.status}
      workflow={RADIOLOGY_QUEUE_WORKFLOW}
      onStatusChange={() => {}}
    />
  </Stack>
</TableCell>


<TableCell>


<Stack
direction="row"
spacing={1}
justifyContent="center"
alignItems="center"
flexWrap="wrap"
>

<WorkflowStatusAction

currentStatus={
patient.status
}

workflow={
RADIOLOGY_QUEUE_WORKFLOW
}

onAction={(action)=>
handleWorkflowAction(
patient.id,
action
)
}

/>


<StatusAlert

status={
patient.status
}

workflow={
RADIOLOGY_QUEUE_WORKFLOW
}

/>

</Stack>


</TableCell>



</TableRow>

))

}



{
filteredRows.length===0 && (

<TableRow>

<TableCell
colSpan={9}
align="center"
sx={{
py:8
}}
>

<Typography
fontWeight={600}
>
No Patients Found
</Typography>

<Typography
color="text.secondary"
>
Try changing search or filters.
</Typography>


</TableCell>

</TableRow>

)

}



</TableBody>


        </Table>


      </TableContainer>


    </Paper>

  );

}