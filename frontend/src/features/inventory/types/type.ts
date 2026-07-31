export interface DepartmentStock {
  id: string;

  departmentName: string;

  departmentType:
    | "Pharmacy"
    | "Radiology"
    | "Laboratory"
    | "Blood Bank"
    | "Emergency"
    | "Operation Theatre"
    | "Ward";

  totalItems: number;

  lowStockItems: number;

  stockValue: number;

  manager: string;

  active: boolean;

  updated: string;
}