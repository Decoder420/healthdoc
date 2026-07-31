"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import IndentStats from "@/components/dashboard/inventory/departments/indent/IndentStats";
import IndentTable from "@/components/dashboard/inventory/departments/indent/IndentTable";
import CreateIndentDialog from "@/components/dashboard/inventory/departments/indent/CreateIndentDialog";
import IndentViewDialog from "@/components/dashboard/inventory/departments/indent/IndentViewDialog";

import { indentRequests } from "./data/indentData";
import { IndentRequest } from "./types/indent";


export default function IndentRequestScreen() {

  const { user } = useAuth();


  const [indents, setIndents] =
    useState<IndentRequest[]>(indentRequests);


  const [openCreate, setOpenCreate] =
    useState(false);


  const [viewOpen, setViewOpen] =
    useState(false);


  const [selectedIndent, setSelectedIndent] =
    useState<IndentRequest | null>(null);



  const handleView = (indent: IndentRequest) => {
    setSelectedIndent(indent);
    setViewOpen(true);
  };


  return (
    <div className="space-y-6">


      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name ?? "Inventory Manager"}
          </h1>


          <p className="mt-1 text-sm text-muted-foreground">
            Manage department stock indent requests and approvals.
          </p>

        </div>



        <button
          className="btn btn-primary"
          onClick={() => setOpenCreate(true)}
        >
          Create Indent
        </button>


      </div>



      {/* Stats */}

      <IndentStats
        indents={indents}
      />



      {/* Table */}

      <section>

        <div className="surface-card overflow-hidden p-5">

          <IndentTable
            indents={indents}
            onView={handleView}
          />

        </div>

      </section>




      {/* Create Indent */}

      <CreateIndentDialog
  open={openCreate}
  onClose={() => setOpenCreate(false)}
   onSave={({ indent, indentItems }) => {
    const completeIndent: IndentRequest = {
      ...indent,
      indentItems,
    };

    setIndents((prev) => [
      completeIndent,
      ...prev,
    ]);

    setOpenCreate(false);
  }}
  
/>




      {/* View Indent */}

      <IndentViewDialog

        open={viewOpen}

        indent={selectedIndent}

        onClose={() => {

          setViewOpen(false);
          setSelectedIndent(null);

        }}

      />


    </div>
  );
}