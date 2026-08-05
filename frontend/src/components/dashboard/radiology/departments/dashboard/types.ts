import { ReactNode } from "react";


// =======================
// Header
// =======================

export interface DashboardHeaderProps {

  title: string;

  subtitle?: string;

  description?: string;

  icon?: ReactNode;

  actions?: ReactNode;

  children?: ReactNode;

}



// =======================
// KPI
// =======================

export interface DashboardStat {

  title: string;

  text: string | number;

  icon?: ReactNode;

}


export interface DashboardStatsProps {

  stats: DashboardStat[];

}




// =======================
// Charts
// =======================

export interface TrendChartData {

  label: string;

  value: number;

}


export interface TrendChartProps {

  title: string;

  subtitle?: string;

  data: TrendChartData[];

  color?: string;

  trend?: string;

  total?: number | string;

  peakLabel?: string;

  action?: ReactNode;

  height?: number;

}


export interface StatusDistributionData {

  name: string;

  value: number;

  color?: string;

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

  day: string;

  minutes: number;

}



export interface ReportingTimeChartProps {

  title: string;

  subtitle?: string;

  data: ReportingTimeData[];

  average?: number;

  target?: number;

  action?: ReactNode;

  height?: number;

}





// =======================
// Chart Configuration
// =======================

export interface ChartConfig {


  trendTitle?: string;

  trendSubtitle?: string;


  statusTitle?: string;

  statusSubtitle?: string;


  reportingTitle?: string;

  reportingSubtitle?: string;


}





// =======================
// Search Toolbar
// =======================

export interface SearchToolbarProps {


  search: string;


  status: string;


  date: string;



  onSearchChange:
  (
    value: string
  ) => void;



  onStatusChange:
  (
    value: string
  ) => void;



  onDateChange:
  (
    value: string
  ) => void;



  onRefresh?:
  () => void;



  onExport?:
  () => void;



  actions?: ReactNode;

}







// =======================
// Radiology Queue
// =======================


export type RadiologyStatus =

  | "Queue"

  | "Processing"

  | "Completed"

  | "No Show"

  | "Removed"

  | "Verified";





export type Priority =

  | "Routine"

  | "Urgent"

  | "Emergency";





export type RadiologyModality =

  | "CT"

  | "MRI"

  | "X-Ray"

  | "USG"

  | "Mammography"

  | "ECG";







export interface RadiologyCase {


  id: number;



  orderId: string;



  accessionNumber: string;



  patientId: string;



  visitId: string;



  token: string;



  patientName: string;



  uhid: string;



  age: number;



  gender:

  | "Male"

  | "Female";



  modality: RadiologyModality;



  procedure: string;



  radiologist: string;



  appointmentDate: string;



  appointmentTime: string;



  priority: Priority;



  status: RadiologyStatus;



  reportAvailable: boolean;


}








// =======================
// Radiology Table
// =======================

export interface RadiologyTableProps {


  rows: RadiologyCase[];



  loading?: boolean;




  renderStatus?:

  (

    row: RadiologyCase

  ) => ReactNode;





  renderActions?:

  (

    row: RadiologyCase

  ) => ReactNode;



}









// =======================
// Radiology Dashboard
// =======================

export interface DepartmentDashboardProps {



  // Header

  title: string;


  subtitle?: string;


  description?: string;


  icon?: ReactNode;





  // KPI Cards

  stats: DashboardStat[];





  // Charts

  trendData: TrendChartData[];


  statusData: StatusDistributionData[];


  reportingData: ReportingTimeData[];





  chartConfig?: ChartConfig;





  // Queue Table

  rows: RadiologyCase[];






  // Custom Render

  renderStatus?:

  (

    row: RadiologyCase

  ) => ReactNode;





  renderActions?:

  (

    row: RadiologyCase

  ) => ReactNode;






  // Events

  onRefresh?:

  () => void;



  onExport?:

  () => void;




  onVerify?:

  (

    row: RadiologyCase

  ) => void;




  onViewReport?:

  (

    row: RadiologyCase

  ) => void;




  loading?: boolean;


}






// =======================
// Filters
// =======================

export interface RadiologyFilters {


  search: string;


  status:

  | "All"

  | RadiologyStatus;



  modality:

  | "All"

  | RadiologyModality;



  priority:

  | "All"

  | Priority;



  date: string;


}





// =======================
// Table Actions
// =======================

export type RadiologyAction =

  | "START_SCAN"

  | "COMPLETE_SCAN"

  | "UPLOAD_REPORT"

  | "VERIFY_REPORT"

  | "VIEW_REPORT";



export interface RadiologyActionPayload {


  action: RadiologyAction;


  row: RadiologyCase;


}