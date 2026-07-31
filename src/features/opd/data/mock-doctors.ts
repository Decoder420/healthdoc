import type { Department, Doctor } from "@/features/opd/types";

export const departments: Department[] = [
  { id: "dept-gm", name: "General Medicine", code: "GM" },
  { id: "dept-cardio", name: "Cardiology", code: "CD" },
  { id: "dept-ortho", name: "Orthopedics", code: "OR" },
  { id: "dept-ent", name: "ENT", code: "EN" },
  { id: "dept-pedia", name: "Pediatrics", code: "PD" },
];

export const doctors: Doctor[] = [
  {
    id: "doc-001",
    name: "Dr. Mehta",
    departmentId: "dept-gm",
    department: "General Medicine",
    departmentCode: "GM",
  },
  {
    id: "doc-002",
    name: "Dr. Singh",
    departmentId: "dept-cardio",
    department: "Cardiology",
    departmentCode: "CD",
  },
  {
    id: "doc-003",
    name: "Dr. Reddy",
    departmentId: "dept-ortho",
    department: "Orthopedics",
    departmentCode: "OR",
  },
  {
    id: "doc-004",
    name: "Dr. Nair",
    departmentId: "dept-ent",
    department: "ENT",
    departmentCode: "EN",
  },
  {
    id: "doc-005",
    name: "Dr. Joshi",
    departmentId: "dept-pedia",
    department: "Pediatrics",
    departmentCode: "PD",
  },
  {
    id: "doc-006",
    name: "Dr. Kapoor",
    departmentId: "dept-gm",
    department: "General Medicine",
    departmentCode: "GM",
  },
];

export function getDoctorsByDepartment(departmentId: string): Doctor[] {
  return doctors.filter((doctor) => doctor.departmentId === departmentId);
}

export function getDepartmentById(departmentId: string): Department | undefined {
  return departments.find((department) => department.id === departmentId);
}

export function getDoctorById(doctorId: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.id === doctorId);
}
