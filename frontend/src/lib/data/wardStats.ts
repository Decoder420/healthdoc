import { WardStat } from "../../features/nurse/components/WardStats/WardStats.types";

export const WARD_STATS: WardStat[] = [
  {
    id: "occupied",
    title: "Occupied Beds",
    value: 18,
    description: "Patients currently admitted",
  },
  {
    id: "available",
    title: "Available Beds",
    value: 6,
    description: "Ready for admission",
  },
  {
    id: "critical",
    title: "Critical Patients",
    value: 3,
    description: "Require close monitoring",
  },
  {
    id: "discharge",
    title: "Discharges Today",
    value: 2,
    description: "Planned discharges",
  },
];