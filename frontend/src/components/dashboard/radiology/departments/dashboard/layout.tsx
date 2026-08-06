"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
} from "@mui/material";


import Header from "./header";
import DashboardStats from "./stats";
import SearchToolBar from "./searchbar";

import TrendChart from "./TrendChart";
import StatusDistributionChart from "./StatusDistributionChart";
import ReportingTimeChart from "./ReportingTimeChart";

import RadiologyTable from "./DeptTable";
import { useRouter } from "next/navigation";

import type {
  DepartmentDashboardProps,
  RadiologyCase,
} from "./types";



export default function DepartmentDashboard({

  title,
  subtitle,
  description,
  icon,

  stats,

  trendData,
  statusData,
  reportingData,

  chartConfig,

  rows,

  renderStatus,
  renderActions,

  onRefresh,
  onExport,

  loading = false,

}: DepartmentDashboardProps) {



const [tableRows,setTableRows] = useState(rows);


const [search,setSearch] = useState("");

const [status,setStatus] = useState("All");


const [date,setDate] = useState(
  new Date()
  .toISOString()
  .split("T")[0]
);





// ============================
// Filtering
// ============================


const filteredRows = useMemo(()=>{


return tableRows.filter((row)=>{


const searchValue =
search.toLowerCase();



const searchMatch =

row.patientName
.toLowerCase()
.includes(searchValue)

||

row.uhid
.toLowerCase()
.includes(searchValue)

||

row.accessionNumber
.toLowerCase()
.includes(searchValue);




const statusMatch =

status === "All"

||

row.status === status;



const dateMatch =

!date

||

row.appointmentDate === date;




return (

searchMatch

&&

statusMatch

&&

dateMatch

);


});


},[
tableRows,
search,
status,
date
]);


// ============================
// Refresh
// ============================


const handleRefresh = ()=>{


setSearch("");

setStatus("All");


setDate(
new Date()
.toISOString()
.split("T")[0]
);


setTableRows(rows);


onRefresh?.();


};






// ============================
// Export
// ============================


const handleExport = ()=>{


onExport?.();



const headers = [

"Patient",

"UHID",

"Accession Number",

"Procedure",

"Status",

"Appointment Date",

];




const csv = [

headers.join(","),


...filteredRows.map((row)=>

[

row.patientName,

row.uhid,

row.accessionNumber,

row.procedure,

row.status,

row.appointmentDate,

].join(",")

)

].join("\n");




const blob = new Blob(

[csv],

{
type:"text/csv;charset=utf-8;"
}

);



const url =
URL.createObjectURL(blob);



const link =
document.createElement("a");


link.href=url;


link.download =
`${title.replace(/\s+/g,"_")}.csv`;



document.body.appendChild(link);


link.click();


document.body.removeChild(link);



URL.revokeObjectURL(url);


};








// ============================
// Default Actions
// ============================
const router = useRouter();


const defaultActions = (row: RadiologyCase) => {
  switch (row.status) {
    case "Processing":
      return (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            router.push(
              `/radiology/test_results?accessionNumber=${row.accessionNumber}`
            )
          }
        >
          View Report
        </Button>
      );

    case "Verified":
      return (
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() =>
            router.push(
              `/radiology/reports/${row.accessionNumber}`
            )
          }
        >
          View Report
        </Button>
      );

    default:
      return null;
  }
};





return (

<>


<Box mb={3}>

<Header

title={title}

subtitle={subtitle}

description={description}

icon={icon}

/>

</Box>





<Box mb={3}>

<DashboardStats

stats={stats}

/>

</Box>







<Paper

elevation={0}

sx={{

p:3,

mb:3,

borderRadius:3,

border:"1px solid",

borderColor:"divider",

}}

>



<Typography

variant="h6"

fontWeight={700}

mb={3}

>

{title} Analytics

</Typography>





<Box

sx={{

display:"flex",

gap:3,

flexDirection:{

xs:"column",

lg:"row"

}

}}

>



<Box flex={1}>

<TrendChart

title={
chartConfig?.trendTitle ??
"Study Volume Trend"
}

subtitle={
chartConfig?.trendSubtitle ??
"Today's Studies"
}

data={trendData}

/>

</Box>





<Divider

orientation="vertical"

flexItem

sx={{

display:{

xs:"none",

lg:"block"

}

}}

/>





<Box flex={1}>

<StatusDistributionChart

title={
chartConfig?.statusTitle ??
"Report Status"
}

subtitle={
chartConfig?.statusSubtitle ??
"Current Workflow"
}

data={statusData}

/>

</Box>





<Divider

orientation="vertical"

flexItem

sx={{

display:{

xs:"none",

lg:"block"

}

}}

/>





<Box flex={1}>

<ReportingTimeChart

title={
chartConfig?.reportingTitle ??
"Reporting Time"
}

subtitle={
chartConfig?.reportingSubtitle ??
"Last 7 Days"
}

data={reportingData}

/>

</Box>



</Box>


</Paper>






<SearchToolBar

search={search}

status={status}

date={date}

onSearchChange={setSearch}

onStatusChange={setStatus}

onDateChange={setDate}

onRefresh={handleRefresh}

onExport={handleExport}

/>






<RadiologyTable

rows={filteredRows}

loading={loading}

renderStatus={renderStatus}

renderActions={
renderActions ??
defaultActions
}

/>



</>

);

}