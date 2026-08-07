"use client";

import Grid from "@mui/material/Grid2";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

import {
  appointmentQueue,
  getRadiologyQueueStats,
} from "@/components/dashboard/radiology/test_queue/DummyData";


export default function KPICards() {


  const stats = getRadiologyQueueStats(
    appointmentQueue
  );


  const kpiCards = [

    {
      id:1,
      title:"Total Studies",
      value:stats.total,
      icon:(
        <GroupsRoundedIcon fontSize="large"/>
      ),
    },


    {
      id:2,
      title:"In Queue",
      value:stats.inQueue,
      icon:(
        <PendingActionsRoundedIcon fontSize="large"/>
      ),
    },


    {
      id:3,
      title:"Processing",
      value:stats.inProgress,
      icon:(
        <CameraAltRoundedIcon fontSize="large"/>
      ),
    },


    {
      id:4,
      title:"Reports Released",
      value:stats.verified,
      icon:(
        <VerifiedRoundedIcon fontSize="large"/>
      ),
    },


    {
      id:5,
      title:"Emergency",
      value:stats.emergency,
      icon:(
        <WarningAmberRoundedIcon fontSize="large"/>
      ),
    },

  ];

 return (
  <Grid container spacing={2}>

    {kpiCards.map((card) => (

      <Grid
        key={card.id}
        size={{
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2.4,
        }}
      >

        <DynamicCard
          title={card.title}
          text={String(card.value)}
          icon={card.icon}
        />

      </Grid>

    ))}

  </Grid>
);
}