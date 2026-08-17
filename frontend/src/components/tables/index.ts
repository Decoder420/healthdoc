/**
 * Shared tables — DataTable (generic) + EMARTable (medication admin).
 */

export { DataTable } from "./DataTable";
export type { DataTableColumn, DataTableProps } from "./DataTable";

export { default as EMARTable } from "./EMARTable";
export type { MedicationRecord, MedicationStatus } from "./EMARTable";
