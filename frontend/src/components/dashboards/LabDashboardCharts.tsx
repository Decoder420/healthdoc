"use client";

import { useMemo, useState } from "react";

import { patients } from "@/lib/mock/lab_data";

import LineChart from "@/components/ui/Lab_LineCharts";
import GenderPieChart from "@/components/ui/Lab_GenderPieChart";
import UrgencyPieChart from "@/components/ui/Lab_Urgency_Pi_Chart";
import CalendarComponent from "@/components/ui/Lab_Calendar";

export default function DashboardCharts() {
  const today = "2026-07-15";

  const [selectedDate, setSelectedDate] =
    useState(today);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (item) =>
        item.order.orderedAt.slice(0, 10) ===
        selectedDate
    );
  }, [selectedDate]);

  return (
    <div className="container-fluid py-3 px-4">
      <div className="row g-3">

        <div className="col-lg-6">
          <div
            className="card shadow-sm"
            style={{
              minHeight: 500,
              borderRadius: 12,
            }}
          >
            <div className="card-body">
              <LineChart patients={filteredPatients} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div
            className="card shadow-sm"
            style={{
              minHeight: 500,
              borderRadius: 12,
            }}
          >
            <div className="card-body">
              <GenderPieChart
                patients={filteredPatients}
              />

              <hr className="my-4" />

              <UrgencyPieChart
                patients={filteredPatients}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div
            className="card shadow-sm"
            style={{
              borderRadius: 12,
            }}
          >
            <div
              className="card-body d-flex justify-content-center align-items-center"
              style={{
                minHeight: 300,
              }}
            >
              <CalendarComponent
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}