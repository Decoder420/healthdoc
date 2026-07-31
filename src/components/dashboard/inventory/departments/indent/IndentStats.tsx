"use client";

import {
  Clock,
  CheckCircle,
  PackageCheck,
  XCircle,
} from "lucide-react";

import { IndentRequest } from "@/features/inventory/types/indent";


interface Props {
  indents: IndentRequest[];
}


export default function IndentStats({ indents }: Props) {


  const pending =
    indents.filter(
      (item) => item.status === "Pending"
    ).length;


  const approved =
    indents.filter(
      (item) => item.status === "Approved"
    ).length;


  const issued =
    indents.filter(
      (item) => item.status === "Issued"
    ).length;


  const rejected =
    indents.filter(
      (item) => item.status === "Rejected"
    ).length;



  const stats = [

    {
      title:"Pending",
      value:pending,
      icon:Clock,
    },

    {
      title:"Approved",
      value:approved,
      icon:CheckCircle,
    },

    {
      title:"Issued",
      value:issued,
      icon:PackageCheck,
    },

    {
      title:"Rejected",
      value:rejected,
      icon:XCircle,
    },

  ];



  return (

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

      {
        stats.map((item)=>{

          const Icon=item.icon;

          return (

            <div
              key={item.title}
              className="surface-card p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    {item.title}
                  </p>


                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>

                </div>


                <Icon size={28}/>

              </div>


            </div>

          )

        })
      }

    </div>

  );
}