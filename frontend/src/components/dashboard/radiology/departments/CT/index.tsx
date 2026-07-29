"use client";

import DepartmentDashboard from "../dashboard/layout";
import { useRouter } from "next/navigation";

import type {
  RadiologyCase,
  TrendChartData,
  StatusDistributionData,
  ReportingTimeData,
} from "../dashboard/types";

import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";



// ============================
// CT DATA
// ============================

const ctRows: RadiologyCase[] = [

  {
    id: "CT001",
    patientName: "Rahul Sharma",
    uhid: "UH10001",
    accessionNo: "ACC-CT-001",
    study: "CT Brain",
    modality: "CT",
    doctor: "Dr. Mehta",
    priority: "Routine",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },


  {
    id: "CT002",
    patientName: "Anita Verma",
    uhid: "UH10002",
    accessionNo: "ACC-CT-002",
    study: "CT Chest",
    modality: "CT",
    doctor: "Dr. Sharma",
    priority: "Urgent",
    status: "VERIFIED",
    studyDate: "2026-07-25",
  },


  {
    id: "CT003",
    patientName: "Mohit Singh",
    uhid: "UH10003",
    accessionNo: "ACC-CT-003",
    study: "CT Abdomen",
    modality: "CT",
    doctor: "Dr. Kapoor",
    priority: "STAT",
    status: "PROCESSING",
    studyDate: "2026-07-25",
  },

];





// ============================
// KPI
// ============================

const stats = [

  {
    title:"Total CT Cases",
    text:54,
  },

  {
    title:"Processing",
    text:8,
  },

  {
    title:"Verified",
    text:42,
  },

  {
    title:"Average Reporting",
    text:"18 min",
  },

];






// ============================
// CHARTS
// ============================

const trendData:TrendChartData[]=[

{
 label:"08:00",
 value:5,
},

{
 label:"10:00",
 value:12,
},

{
 label:"12:00",
 value:20,
},

{
 label:"14:00",
 value:32,
},

{
 label:"16:00",
 value:24,
},

{
 label:"18:00",
 value:15,
},

];





const statusData:StatusDistributionData[]=[

{
 name:"Processing",
 value:8,
},

{
 name:"Verified",
 value:42,
},

];






const reportingData:ReportingTimeData[]=[

{
 day:"Mon",
 minutes:18,
},

{
 day:"Tue",
 minutes:16,
},

{
 day:"Wed",
 minutes:20,
},

{
 day:"Thu",
 minutes:15,
},

{
 day:"Fri",
 minutes:14,
},

{
 day:"Sat",
 minutes:17,
},

{
 day:"Sun",
 minutes:12,
},

];







// ============================
// PAGE
// ============================


export default function CTDashboard(){

const router = useRouter();

return (

<DepartmentDashboard


title="CT Scan Dashboard"


subtitle="Today's CT Workflow"


description="Manage CT scans, verification and reports."


icon={
<MedicalServicesOutlinedIcon/>
}



stats={stats}



trendData={trendData}



statusData={statusData}



reportingData={reportingData}





chartConfig={{

trendTitle:"CT Study Volume",

trendSubtitle:"Today's CT studies",


statusTitle:"CT Report Status",

statusSubtitle:"Processing vs Verified",


reportingTitle:"CT Reporting Time",

reportingSubtitle:"Last 7 days",

}}





rows={ctRows}







onVerify={(row)=>{


console.log(
"Verify CT Report",
row.id
);


// API:
// PATCH /radiology/ct/{id}/status
// body: {status:"VERIFIED"}


}}







onViewReport={(row) => {
  router.push(`/radiology/reports/${row.id}`);
}}







onRefresh={()=>{

console.log(
"Refresh CT Dashboard"
);

}}







onExport={()=>{

console.log(
"Export CT Reports"
);

}}




/>

);

}