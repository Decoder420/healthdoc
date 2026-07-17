"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useChartTheme } from "@/hooks/useChartTheme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
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
  const chartTheme = useChartTheme();
  const buckets: Record<string, number> = {};

  for (let hour = 0; hour < 24; hour++) {
    const nextHour = (hour + 1) % 24;
    const slot = `${String(hour).padStart(2, "0")}:00-${String(nextHour).padStart(2, "0")}:00`;
    buckets[slot] = 0;
  }

  patients.forEach((patient) => {
    const hour = Number(patient.order.orderedAt.substring(11, 13));
    const nextHour = (hour + 1) % 24;
    const slot = `${String(hour).padStart(2, "0")}:00-${String(nextHour).padStart(2, "0")}:00`;
    buckets[slot]++;
  });

  const data = {
    labels: Object.keys(buckets),
    datasets: [
      {
        label: "Patients",
        data: Object.values(buckets),
        borderColor: chartTheme.line,
        backgroundColor: chartTheme.lineFill,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: chartTheme.line,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: chartTheme.text },
      },
    },
    scales: {
      x: {
        ticks: { color: chartTheme.muted },
        grid: { color: chartTheme.grid },
        title: {
          display: true,
          text: "Time",
          color: chartTheme.text,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: chartTheme.muted,
        },
        grid: { color: chartTheme.grid },
        title: {
          display: true,
          text: "Patients",
          color: chartTheme.text,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "450px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
