"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";

import { useRouter } from "next/navigation";

import {
  interactionWarnings,
} from "@/features/pharmacy/data/dashboardData";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InteractionDialog({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const handleReviewPrescription = () => {
    onClose();

    router.push("/pharmacy/prescription-queue");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Drug Interaction Alerts
      </DialogTitle>

      <DialogContent dividers>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#001F54] text-white">
              <tr>
                <th className="px-4 py-3 text-left">
                  Patient
                </th>

                <th className="px-4 py-3 text-left">
                  UHID
                </th>

                <th className="px-4 py-3 text-left">
                  Prescription
                </th>

                <th className="px-4 py-3 text-left">
                  Interaction
                </th>

                <th className="px-4 py-3 text-center">
                  Severity
                </th>
              </tr>
            </thead>

            <tbody>
              {interactionWarnings.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {item.patient}
                  </td>

                  <td className="px-4 py-3">
                    {item.uhid}
                  </td>

                  <td className="px-4 py-3">
                    {item.prescription}
                  </td>

                  <td className="px-4 py-3">
                    {item.interaction}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Chip
                      label={item.severity}
                      size="small"
                      color={
                        item.severity === "High"
                          ? "error"
                          : item.severity === "Medium"
                          ? "warning"
                          : "success"
                      }
                    />
                  </td>
                </tr>
              ))}
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

        <Button
          variant="contained"
          onClick={handleReviewPrescription}
        >
          Review Prescription
        </Button>
      </DialogActions>
    </Dialog>
  );
}