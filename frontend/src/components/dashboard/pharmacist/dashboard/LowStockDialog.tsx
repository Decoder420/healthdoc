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

import { lowStockData } from "@/features/pharmacy/data/dashboardData";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LowStockDialog({
  open,
  onClose,
}: Props) {
  const router = useRouter();

  const handleCreateIndent = () => {
    onClose();
    router.push("/inventory/departments/indent");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Low Stock Medicines
      </DialogTitle>

      <DialogContent dividers>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#001F54] text-white">
              <tr>
                <th className="px-4 py-3 text-left">
                  Medicine
                </th>

                <th className="px-4 py-3 text-center">
                  Available
                </th>

                <th className="px-4 py-3 text-center">
                  Reorder Level
                </th>

                <th className="px-4 py-3 text-left">
                  Supplier
                </th>

                <th className="px-4 py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {lowStockData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {item.medicine}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.available}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.reorderLevel}
                  </td>

                  <td className="px-4 py-3">
                    {item.supplier}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Chip
                      label="Low Stock"
                      color="error"
                      size="small"
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
          onClick={handleCreateIndent}
        >
          Create Indent
        </Button>
      </DialogActions>
    </Dialog>
  );
}