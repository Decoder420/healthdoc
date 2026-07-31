"use client";

import { useMemo, useState } from "react";

import Breadcrumbs from "@/components/shared/Breadcrumbs";

import QueueHeader from "@/components/dashboard/pharmacist/Queue/QueueHeader";
import QueueStats from "@/components/dashboard/pharmacist/Queue/QueueStats";
import QueueFilters from "@/components/dashboard/pharmacist/Queue/QueueFilters";
import QueueTable from "@/components/dashboard/pharmacist/Queue/QueueTable";
import PrescriptionReviewModal from "@/components/dashboard/pharmacist/Queue/PrescriptionReviewModal";
import { queueData } from "@/features/pharmacy/data/queueData";

import { QueueItem, QueueStatus } from "@/features/pharmacy/types";

export default function PharmacyPrescriptionQueueScreen() {
 const [queue, setQueue] = useState(queueData);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [priority, setPriority] = useState("All Priority");
  const [selectedPrescription, setSelectedPrescription] = useState<QueueItem | null>(null);
  
const [openReview, setOpenReview] = useState(false);
const [loading, setLoading] = useState(false);

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const matchesSearch =
        item.patientName.toLowerCase().includes(search.toLowerCase()) ||
        item.uhid.toLowerCase().includes(search.toLowerCase()) ||
        item.queueNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All Status" || item.status === status;

      const matchesPriority =
        priority === "All Priority" || item.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [queue, search, status, priority]);

  
const refreshQueue = () => {
  setLoading(true);

  setTimeout(() => {
    setSearch("");
    setStatus("All Status");
    setPriority("All Priority");

    setQueue(queueData);

    setSelectedPrescription(null);
    setOpenReview(false);

    setLoading(false);
  }, 500);
};

  const handleStatusChange = (
  id: string,
  status: QueueStatus,
  details?: {
    holdReason?: string;
    holdNotes?: string;
    clarificationReason?: string;
    clarificationMessage?: string;
    pharmacistNotes?: string;
  }
) => {
  setQueue((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            ...details,
          }
        : item
    )
  );
};

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Pharmacy", href: "/pharmacy" },
          { label: "Prescription Queue" },
        ]}
      />

      <QueueHeader onRefresh={refreshQueue}
      loading={loading}
      />

      <QueueStats queue={queue}/>

      <QueueFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
      />

      <QueueTable data={filteredQueue}   onReview={(item) => {
        setSelectedPrescription(item);
        setOpenReview(true);
    }} />

<PrescriptionReviewModal
    open={openReview}
    prescription={selectedPrescription}
    onClose={() => setOpenReview(false)}
     onStatusChange={handleStatusChange}
/>

    </div>
  );
}