"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LabPatient {
  status: string;
  patient: {
    patientId: string;
    uhid: string;
    name: string;
    age: number;
    gender: string;
    mobile: string;
  };
  visit: {
    visitId: string;
    visitType: string;
  };
  doctor: {
    doctorId: string;
    name: string;
    department: string;
  };
  order: {
    orderId: string;
    priority: string;
    orderedAt: string;
  };
  sample: unknown;
  requestedTests: string[];
  results: unknown[];
}

interface Props {
  patients: LabPatient[];
}

export default function GenderPieChart({ patients }: Props) {
  const chartTheme = useChartTheme();

  const male = patients.filter(
    (p) => p.patient.gender.toLowerCase() === "male"
  ).length;

  const female = patients.filter(
    (p) => p.patient.gender.toLowerCase() === "female"
  ).length;

  const other = patients.filter(
    (p) => p.patient.gender.toLowerCase() === "other"
  ).length;

  const total = male + female + other;

  const data = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        data: [male, female, other],
        backgroundColor: ["#3B82F6", "#EC4899", "#10B981"],
        borderColor: chartTheme.border,
        borderWidth: 3,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle" as const,
          padding: 8,
          boxWidth: 8,
          color: chartTheme.text,
          font: {
            size: 10,
            weight: "bold" as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; raw: unknown }) => {
            const value = Number(context.raw);
            const percentage =
              total === 0 ? 0 : ((value / total) * 100).toFixed(1);

            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Pie data={data} options={options} />
    </div>
  );
}