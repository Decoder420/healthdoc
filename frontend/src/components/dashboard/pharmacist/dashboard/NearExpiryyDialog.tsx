"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";



import { nearExpiryData } from "@/features/pharmacy/data/dashboardData";

interface Props {
  open: boolean;
  onClose: () => void;
    onViewExpiry: () => void;

}

export default function NearExpiryyDialog({
  open,
  onClose,
   onViewExpiry,
}: Props) {


  const handleViewExpiryTracker = () => {

    onViewExpiry();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Near Expiry Medicines
      </DialogTitle>

      <DialogContent dividers>
        {nearExpiryData.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No medicines are near expiry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-[#001F54] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Medicine
                  </th>

                  <th className="px-4 py-3 text-left">
                    Batch
                  </th>

                  <th className="px-4 py-3 text-center">
                    Available
                  </th>

                  <th className="px-4 py-3 text-left">
                    Expiry Date
                  </th>

                  <th className="px-4 py-3 text-center">
                    Days Left
                  </th>

                  <th className="px-4 py-3 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {nearExpiryData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.medicine}
                    </td>

                    <td className="px-4 py-3">
                      {item.batch}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3">
                      {item.expiry}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.daysLeft}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Chip
                        label={
                          item.daysLeft <= 30
                            ? "Critical"
                            : item.daysLeft <= 60
                            ? "Near Expiry"
                            : "Monitor"
                        }
                        size="small"
                        color={
                          item.daysLeft <= 30
                            ? "error"
                            : item.daysLeft <= 60
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
        )}
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
          onClick={handleViewExpiryTracker}
        >
          View Expiry Tracker
        </Button>
      </DialogActions>
    </Dialog>
  );
}