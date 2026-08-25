/**
 * HealthDoc shared component library
 * ----------------------------------
 * Import style:
 *   import { MetricCard, StatusChip, ExpiryChip } from "@/components/ui";
 *   import { DataTable, EMARTable } from "@/components/tables";
 *   import { WorkflowStatusStepper, BarcodeDisplay } from "@/components/shared";
 *   import BedGrid from "@/components/BedGrid";
 *   import VitalsTimeline from "@/components/VitalsTimeline";
 */

export * from "./ui";
export * from "./tables";
export * from "./shared";

export { default as BedGrid } from "./BedGrid";
export type { Bed, BedStatus } from "./BedGrid";

export { default as VitalsTimeline, VitalsChart } from "./VitalsTimeline";
export type { VitalRecord, VitalsChartProps } from "./VitalsTimeline";
