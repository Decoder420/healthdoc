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

export default function UrgencyPieChart({ patients }: Props) {
  const chartTheme = useChartTheme();

  const urgent = patients.filter(
    (p) => p.order.priority.toLowerCase() === "urgent"
  ).length;

  const emergency = patients.filter(
    (p) => p.order.priority.toLowerCase() === "emergency"
  ).length;

  const elective = patients.filter(
    (p) => p.order.priority.toLowerCase() === "elective"
  ).length;

  const total = urgent + emergency + elective;

  const data = {
    labels: ["Urgent", "Emergency", "Elective"],
    datasets: [
      {
        data: [urgent, emergency, elective],
        backgroundColor: ["#F59E0B", "#EF4444", "#22C55E"],
        borderColor: chartTheme.border,
        borderWidth: 2,
        hoverOffset: 8,
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
          color: chartTheme.text,
          usePointStyle: true,
          pointStyle: "circle" as const,
          padding: 8,
          boxWidth: 8,
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
    <div className="h-full w-full min-h-0">
      <Pie data={data} options={options} />
    </div>
  );
}