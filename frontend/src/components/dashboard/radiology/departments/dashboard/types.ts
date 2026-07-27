import { ReactNode } from "react";


// =======================
// Header
// =======================

export interface DashboardHeaderProps {

  title:string;

  subtitle?:string;

  description?:string;

  icon?:ReactNode;

  actions?:ReactNode;

  children?:ReactNode;

}



// =======================
// KPI
// =======================

export interface DashboardStat {

  title:string;

  text:string | number;

  icon?:ReactNode;

}


export interface DashboardStatsProps {

  stats:DashboardStat[];

}





// =======================
// Charts
// =======================

export interface TrendChartData {

  label:string;

  value:number;

}



export interface StatusDistributionData {

  name:string;

  value:number;

}

export interface StatusDistributionChartProps {

  title: string;

  subtitle?: string;

  data: StatusDistributionData[];

  total?: number;

  action?: ReactNode;

  height?: number;

}



export interface ReportingTimeData {

  day:string;

  minutes:number;

}





export interface ChartConfig {


  trendTitle?:string;

  trendSubtitle?:string;


  statusTitle?:string;

  statusSubtitle?:string;


  reportingTitle?:string;

  reportingSubtitle?:string;


}






// =======================
// Search Toolbar
// =======================

export interface SearchToolbarProps {

  search:string;

  status:string;

  date:string;


  onSearchChange:
  (value:string)=>void;


  onStatusChange:
  (value:string)=>void;


  onDateChange:
  (value:string)=>void;


  onRefresh?:
  ()=>void;


  onExport?:
  ()=>void;


  actions?:ReactNode;

}





// =======================
// Radiology Case
// =======================


export type RadiologyStatus =
  | "PROCESSING"
  | "VERIFIED";



export type Priority =

| "Routine"

| "Urgent"

| "STAT";




export interface RadiologyCase {


  id:string;


  patientName:string;


  uhid:string;


  accessionNo:string;


  study:string;


  modality:
  | "CT"
  | "MRI"
  | "XRAY"
  | "USG"
  | "MAMMOGRAPHY"
  | "ECG";



  doctor:string;



  priority:Priority;



  status:RadiologyStatus;



  studyDate:string;


}







// =======================
// Radiology Table
// =======================


export interface RadiologyTableProps {


  rows:RadiologyCase[];


  loading?:boolean;



  renderStatus?:
  (
    row:RadiologyCase
  )=>ReactNode;



  renderActions?:
  (
    row:RadiologyCase
  )=>ReactNode;


}








// =======================
// Radiology Dashboard
// =======================


export interface DepartmentDashboardProps {



  // Header

  title:string;

  subtitle?:string;

  description?:string;

  icon?:ReactNode;




  // KPI Cards

  stats:DashboardStat[];





  // Charts

  trendData:TrendChartData[];


  statusData:StatusDistributionData[];


  reportingData:ReportingTimeData[];




  chartConfig?:ChartConfig;





  // Table

  rows:RadiologyCase[];




  // Custom Rendering

  renderStatus?:
  (
    row:RadiologyCase
  )=>ReactNode;



  renderActions?:
  (
    row:RadiologyCase
  )=>ReactNode;





  // Events

  onRefresh?:
  ()=>void;



  onExport?:
  ()=>void;

  onVerify?: (
    row: RadiologyCase
  ) => void;


  onViewReport?: (
    row: RadiologyCase
  ) => void;



  loading?:boolean;


}