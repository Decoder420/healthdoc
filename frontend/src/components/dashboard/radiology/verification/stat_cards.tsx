"use client";

import Grid from "@mui/material/Grid2";

import {
  BadgeCheck,
  ClipboardCheck,
  UsersRound,
  ShieldAlert,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

import {
  appointmentQueue,
} from "@/components/dashboard/radiology/test_queue/DummyData";


const iconSize = 30;


export default function VerificationKPICards() {


  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  // Only verified reports
  const verifiedReports =
    appointmentQueue.filter(
      (item) =>
        item.reportStatus === "Verified"
    );


  const totalReports =
    verifiedReports.length;



  const todayReports =
    verifiedReports.filter(
      (item) =>
        item.appointmentDate === today
    ).length;



  const totalPatients =
    new Set(
      verifiedReports.map(
        (item) =>
          item.patientId
      )
    ).size;



  const criticalReports =
    verifiedReports.filter(
      (item) =>
        item.priority === "Emergency"
    ).length;



  const kpiData = [

    {
      title: "Verified Reports",
      text: String(totalReports),
      icon: (
        <BadgeCheck
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },


    {
      title: "Verified Today",
      text: String(todayReports),
      icon: (
        <ClipboardCheck
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },


    {
      title: "Patients",
      text: String(totalPatients),
      icon: (
        <UsersRound
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },


    {
      title: "Critical Reports",
      text: String(criticalReports),
      icon: (
        <ShieldAlert
          size={iconSize}
          strokeWidth={2.2}
        />
      ),
    },

  ];



  return (

    <Grid
      container
      spacing={3}
    >

      {
        kpiData.map((card)=>(

          <Grid
            key={card.title}
            size={{
              xs:12,
              sm:6,
              lg:3,
            }}
          >

            <DynamicCard
              title={card.title}
              text={card.text}
              icon={card.icon}
            />

          </Grid>

        ))
      }

    </Grid>

  );
}