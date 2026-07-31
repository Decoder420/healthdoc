"use client";

import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";

import { returnMedicineData } from "@/features/pharmacy/data/dashboardData";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ReturnMedicineDialog({
  open,
  onClose,
}: Props) {

  const [requests, setRequests] = useState(returnMedicineData);

  const updateStatus = (
    id: number,
    status: "Approved" | "Rejected"
  ) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Return Medicine Requests
      </DialogTitle>

      <DialogContent dividers>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#001F54] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Medicine</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.patient}
                  </td>

                  <td className="px-4 py-3">
                    {item.medicine}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.quantity}
                  </td>

                  <td className="px-4 py-3">
                    {item.reason}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Chip
                      label={item.status}
                      size="small"
                      color={
                        item.status === "Approved"
                          ? "success"
                          : item.status === "Rejected"
                          ? "error"
                          : "warning"
                      }
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={item.status !== "Pending"}
                        onClick={() =>
                          updateStatus(item.id, "Approved")
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={item.status !== "Pending"}
                        onClick={() =>
                          updateStatus(item.id, "Rejected")
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    No return medicine requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}