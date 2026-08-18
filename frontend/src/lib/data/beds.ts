import { Bed } from "@/components/BedGrid";

export const beds: Bed[] = [
  {
    id: "1",
    ward_id: "general",
    bed_number: "B-101",
    status: "occupied",
  },
  {
    id: "2",
    ward_id: "general",
    bed_number: "B-102",
    status: "vacant",
  },
  {
    id: "3",
    ward_id: "icu",
    bed_number: "I-201",
    status: "reserved",
  },
  {
    id: "4",
    ward_id: "icu",
    bed_number: "I-202",
    status: "vacant",
  },
  {
    id: "5",
    ward_id: "ccu",
    bed_number: "C-301",
    status: "occupied",
  },
];