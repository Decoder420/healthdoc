"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

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

export default function PatientLineChart({ patients }: Props) {
  const buckets: Record<string, number> = {};

  // Create 24-hour buckets
  for (let hour = 0; hour < 24; hour++) {
    const nextHour = (hour + 1) % 24;

    const slot = `${String(hour).padStart(2, "0")}:00-${String(
      nextHour
    ).padStart(2, "0")}:00`;

    buckets[slot] = 0;
  }

  // Count patients
 patients.forEach((patient) => {
  const hour = Number(
    patient.order.orderedAt.substring(11, 13)
  );

  const nextHour = (hour + 1) % 24;

  const slot = `${String(hour).padStart(2, "0")}:00-${String(
    nextHour
  ).padStart(2, "0")}:00`;

  buckets[slot]++;
});

  const data = {
    labels: Object.keys(buckets),
    datasets: [
      {
        label: "Patients",
        data: Object.values(buckets),
        borderColor: "#1976d2",
        backgroundColor: "rgba(25,118,210,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: "#1976d2",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Patients",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "450px",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
}