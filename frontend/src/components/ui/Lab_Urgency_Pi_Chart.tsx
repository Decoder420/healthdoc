"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Pie } from "react-chartjs-2";

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

export default function UrgencyPieChart({
  patients,
}: Props) {
  const urgent = patients.filter(
    (p) =>
      p.order.priority.toLowerCase() === "urgent"
  ).length;

  const emergency = patients.filter(
    (p) =>
      p.order.priority.toLowerCase() ===
      "emergency"
  ).length;

  const elective = patients.filter(
    (p) =>
      p.order.priority.toLowerCase() ===
      "elective"
  ).length;

  const total =
    urgent + emergency + elective;

  const data = {
    labels: ["Urgent", "Emergency", "Elective"],
    datasets: [
      {
        data: [
          urgent,
          emergency,
          elective,
        ],
        backgroundColor: [
          "#FF9800",
          "#F44336",
          "#4CAF50",
        ],
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle" as const,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const value = Number(context.raw ?? 0);
            const percentage =
              total === 0
                ? 0
                : (
                    (value / total) *
                    100
                  ).toFixed(1);

            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: "Patient Priority",
      },
    },
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      <div
        style={{
          width: "220px",
          height: "220px",
        }}
      >
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}