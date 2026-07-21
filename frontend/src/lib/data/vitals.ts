import { VitalRecord } from "@/components/shared/VitalsTimeline";

export const vitals: VitalRecord[] = [
  {
    id: "1",
    recordedAt: "08:00 AM",
    temperature: 98.6,
    pulse: 74,
    respiratoryRate: 18,
    bloodPressure: "120/80",
    oxygenSaturation: 98,
    recordedBy: "Nurse Anita",
  },
  {
    id: "2",
    recordedAt: "12:00 PM",
    temperature: 99.1,
    pulse: 78,
    respiratoryRate: 19,
    bloodPressure: "122/82",
    oxygenSaturation: 97,
    recordedBy: "Nurse Anita",
  },
  {
    id: "3",
    recordedAt: "04:00 PM",
    temperature: 98.8,
    pulse: 76,
    respiratoryRate: 18,
    bloodPressure: "118/79",
    oxygenSaturation: 99,
    recordedBy: "Nurse Rahul",
  },
];