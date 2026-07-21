import { Bed } from "@/components/BedGrid";

export const beds: Bed[] = [
  {
    id: "1",
    bedNumber: "B-101",
    patientName: "Rahul Kumar",
    status: "Occupied",
    wardName: "ICU",
  },
  {
    id: "2",
    bedNumber: "B-102",
    status: "Vacant",
    wardName: "ICU",
  },
  {
    id: "3",
    bedNumber: "B-103",
    patientName: "Amit Singh",
    status: "Reserved",
    wardName: "ICU",
  },
  {
    id: "4",
    bedNumber: "B-104",
    status: "Cleaning",
    wardName: "ICU",
  },
];