"use client";

import {
  FlaskConical,
  BadgeCheck,
  Clock3,
  TriangleAlert,
} from "lucide-react";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

import {
  getLabSampleKpis,
  LabPatientOrder,
} from "@/lib/mock/lab_data";


interface Props {
  patients: LabPatientOrder[];
}


const iconSize = 30;


export default function SampleKPICards({
  patients,
}: Props) {


  const kpis =
    getLabSampleKpis(patients);



  const kpiData = [

    {
      title: "Total Samples",

      text: String(
        kpis.totalSamples
      ),

      icon: (
        <FlaskConical
          size={iconSize}
          strokeWidth={2.2}
        />
      ),

    },


    {
      title: "Collected Today",

      text: String(
        kpis.collectedToday
      ),

      icon: (
        <BadgeCheck
          size={iconSize}
          strokeWidth={2.2}
        />
      ),

    },


    {
      title: "Pending Collection",

      text: String(
        kpis.pendingCollection
      ),

      icon: (
        <Clock3
          size={iconSize}
          strokeWidth={2.2}
        />
      ),

    },


    {
      title: "Urgent Samples",

      text: String(
        kpis.urgentSamples
      ).padStart(2,"0"),


      icon: (
        <TriangleAlert
          size={iconSize}
          strokeWidth={2.2}
        />
      ),

    },

  ];






  return (

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {
        kpiData.map((card)=>(

          <DynamicCard

            key={card.title}

            title={card.title}

            text={card.text}

            icon={card.icon}

          />

        ))
      }


    </div>

  );

}