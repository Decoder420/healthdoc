"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";

import { Plus, Trash2 } from "lucide-react";

import { inventoryItems } from "@/features/inventory/data/indentData";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

interface IndentItem {
  id: string;
  itemId: string;
  itemName: string;
  availableStock: number;
  quantity: number;
}

export default function CreateIndentDialog({
  open,
  onClose,
  onSave,
}: Props) {
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState<IndentItem[]>([]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(
      (item) => item.department === department
    );
  }, [department]);

  const handleAddItem = () => {
    if (!department) return;

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemId: "",
        itemName: "",
        availableStock: 0,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((row) => row.id !== id));
  };

  const handleItemChange = (
    rowId: string,
    selectedItemId: string
  ) => {
    const selected = inventoryItems.find(
      (item) => item.id === selectedItemId
    );

    if (!selected) return;

    setItems((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              itemId: selected.id,
              itemName: selected.name,
              availableStock: selected.stock,
            }
          : row
      )
    );
  };

  const handleQuantityChange = (
    rowId: string,
    qty: number
  ) => {
    setItems((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              quantity: qty,
            }
          : row
      )
    );
  };

  const handleSubmit = () => {
    const indent = {
      id: crypto.randomUUID(),
      requestNumber: `IND-${Date.now()}`,
      departmentId: department,
      departmentName: department,
      requestedBy: "Inventory Manager",
      priority,
      status: "Pending",
      items: items.length,
      totalQuantity: items.reduce(
        (sum, row) => sum + row.quantity,
        0
      ),
      createdAt: new Date().toLocaleDateString(),
      remarks,
    };

    onSave?.({
      indent,
      indentItems: items,
    });

    setDepartment("");
    setPriority("Normal");
    setRemarks("");
    setItems([]);

    onClose();
  };

    return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle className="text-xl font-semibold">
        Create Department Indent
      </DialogTitle>

      <DialogContent>

        {/* Basic Information */}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

          <TextField
            select
            fullWidth
            label="Department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setItems([]);
            }}

             sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}
          >
            <MenuItem value="Radiology">
              Radiology
            </MenuItem>

            <MenuItem value="Laboratory">
              Laboratory
            </MenuItem>

            <MenuItem value="Operation Theatre">
              Operation Theatre
            </MenuItem>

            <MenuItem value="Emergency">
              Emergency
            </MenuItem>

            <MenuItem value="Pharmacy">
              Pharmacy
            </MenuItem>

          </TextField>


          <TextField
            select
            fullWidth
            label="Priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
             sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}
          >
            <MenuItem value="Normal">
              Normal
            </MenuItem>

            <MenuItem value="Urgent">
              Urgent
            </MenuItem>

            <MenuItem value="Emergency">
              Emergency
            </MenuItem>

          </TextField>

        </div>


        <div className="mt-4">

          <TextField
            fullWidth
            label="Requested By"
            value="Inventory Manager"
            disabled
              sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}

          />

        </div>


        <Divider className="my-6" />


        {/* Requested Items Header */}

        <div className="mb-4 flex items-center justify-between">

          <Typography
            variant="h6"
            className="font-semibold"
          >
            Requested Items
          </Typography>

          <Button
            variant="outlined"
            startIcon={<Plus size={18} />}
            onClick={handleAddItem}
            disabled={!department}
          >
            Add Item
          </Button>

        </div>


        {items.length === 0 && (

          <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">

            <Typography
              color="text.secondary"
            >
              Click "Add Item" to add medicines or consumables.
            </Typography>

          </div>

        )}

                {items.map((row) => (
          <div
            key={row.id}
            className="mb-4 rounded-lg border p-4"
          >
            <div className="grid grid-cols-12 gap-3">

              {/* Item */}

              <div className="col-span-5">
                <TextField
                  select
                  fullWidth
                  label="Item"
                  value={row.itemId}
                  onChange={(e) =>
                    handleItemChange(
                      row.id,
                      e.target.value
                    )
                  }
                   sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}

                >
                  {filteredItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Available Stock */}

              <div className="col-span-3">
                <TextField
                  fullWidth
                  label="Available Stock"
                  value={row.availableStock}
                  disabled

                   sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}
                />
              </div>

              {/* Quantity */}

              <div className="col-span-3">
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={row.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      row.id,
                      Number(e.target.value)
                    )
                  }
                   sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}
                />
              </div>

              {/* Delete */}

              <div className="col-span-1 flex items-center justify-center">
                <IconButton
                  color="error"
                  onClick={() =>
                    handleRemoveItem(row.id)
                  }
                >
                  <Trash2 size={18} />
                </IconButton>
              </div>

            </div>
          </div>
        ))}

        {/* Remarks */}

        <div className="mt-5">

          <TextField
            fullWidth
            multiline
          
            label="Remarks"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
              
            }
             sx={{
    "& .MuiOutlinedInput-root": {
      height: 56,
    },
  }}
          />

        </div>

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !department || items.length === 0
          }
        >
          Submit Indent
        </Button>

      </DialogActions>

    </Dialog>
  );
}