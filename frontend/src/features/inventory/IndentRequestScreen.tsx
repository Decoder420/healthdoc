"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";

import IndentStats from "@/components/dashboard/inventory/departments/indent/IndentStats";
import IndentTable from "@/components/dashboard/inventory/departments/indent/IndentTable";
import CreateIndentDialog from "@/components/dashboard/inventory/departments/indent/CreateIndentDialog";
import IndentViewDialog from "@/components/dashboard/inventory/departments/indent/IndentViewDialog";

import {
  getIndentRequests,
  addIndentRequest,
  updateIndentRequest,
} from "./data/indentData";

import type { IndentRequest } from "./types/indent";

export default function IndentRequestScreen() {
  const { user } = useAuth();

  const [indents, setIndents] = useState<IndentRequest[]>([]);

  const [openCreate, setOpenCreate] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);

  const [selectedIndent, setSelectedIndent] =
    useState<IndentRequest | null>(null);

  useEffect(() => {
    const data = getIndentRequests();
    setIndents(data);
  }, []);

  const handleView = (indent: IndentRequest) => {
    setSelectedIndent(indent);
    setViewOpen(true);
  };

  const handleCreateIndent = ({
    indent,
    indentItems,
  }: {
    indent: Record<string, unknown>;
    indentItems: {
      id: string;
      itemId: string;
      itemName: string;
      availableStock: number;
      quantity: number;
    }[];
  }) => {
    const completeIndent: IndentRequest = {
      ...(indent as unknown as IndentRequest),
      indentItems,
    };

    addIndentRequest(completeIndent);

    setIndents((prev) => [
      completeIndent,
      ...prev,
    ]);

    setOpenCreate(false);
  };

  const handleApprove = (indent: IndentRequest) => {
    const updatedIndent: IndentRequest = {
      ...indent,
      status: "Approved",
    };

    updateIndentRequest(
      updatedIndent.id,
      updatedIndent
    );

    setIndents((prev) =>
      prev.map((item) =>
        item.id === updatedIndent.id
          ? updatedIndent
          : item
      )
    );
  };

  return (
    <div className="space-y-6">

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
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenCreate(true)}
          style={{
            backgroundColor: "#001f54",
            borderColor: "#001f54",
            color: "#ffffff",
            minHeight: 40,
            padding: "0.625rem 1rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
          }}
        >
          Create Indent
        </button>
      </div>

      <IndentStats indents={indents} />

      <section>
        <div className="surface-card overflow-hidden p-5">
          <IndentTable
            indents={indents}
            onView={handleView}
            onApprove={handleApprove}
          />
        </div>
      </section>

      <CreateIndentDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreateIndent}
      />

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