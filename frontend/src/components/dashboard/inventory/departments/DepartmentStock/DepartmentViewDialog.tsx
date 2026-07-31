"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
} from "@mui/material";

import {
  Building2,
  Package,
  AlertTriangle,
  Activity,
  Calendar,
} from "lucide-react";

import { DepartmentStock } from "@/features/inventory/types/type";


interface Props {
  open: boolean;
  department: DepartmentStock | null;
  onClose: () => void;
}


export default function DepartmentViewDialog({
  open,
  department,
  onClose,
}: Props) {

  if (!department) return null;


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold">
              {department.departmentName}
            </h2>

            <p className="text-sm text-muted-foreground">
              Department Stock Details
            </p>
          </div>


          <Chip
            label={
              department.active
                ? "Active"
                : "Inactive"
            }
            color={
              department.active
                ? "success"
                : "error"
            }
          />

        </div>
      </DialogTitle>



      <DialogContent>

        {/* Summary Cards */}

        <div className="grid grid-cols-3 gap-4 mt-4">


          <div className="rounded-xl border p-4">
            <Package size={20}/>
            <p className="text-xs text-muted-foreground mt-2">
              Total Items
            </p>

            <p className="text-xl font-bold">
              {department.totalItems}
            </p>
          </div>



          <div className="rounded-xl border p-4">
            <AlertTriangle size={20}/>

            <p className="text-xs text-muted-foreground mt-2">
              Low Stock
            </p>

            <p className="text-xl font-bold text-red-600">
              {department.lowStockItems}
            </p>
          </div>



          <div className="rounded-xl border p-4">
            <Activity size={20}/>

            <p className="text-xs text-muted-foreground mt-2">
              Status
            </p>

            <p className="text-xl font-bold">
              {department.active
                ? "Good"
                : "Inactive"}
            </p>
          </div>


        </div>



        <Divider className="my-5"/>



        {/* Details */}

        <div className="space-y-4">


          <div className="flex items-center gap-3">

            <Building2 size={20}/>

            <div>
              <p className="text-sm text-muted-foreground">
                Department Type
              </p>

              <p className="font-medium">
                {department.departmentType}
              </p>
            </div>

          </div>



          <div className="flex items-center gap-3">

            <Building2 size={20}/>

            <div>
              <p className="text-sm text-muted-foreground">
                Department ID
              </p>

              <p className="font-medium">
                {department.id}
              </p>
            </div>

          </div>



          <div className="flex items-center gap-3">

            <Calendar size={20}/>

            <div>
              <p className="text-sm text-muted-foreground">
                Last Updated
              </p>

              <p className="font-medium">
                29 July 2026
              </p>
            </div>

          </div>


        </div>



        <Divider className="my-5"/>



        {/* Stock Health */}

        <div className="rounded-xl bg-muted p-4">

          <h3 className="font-semibold mb-2">
            Stock Health
          </h3>


          {
            department.lowStockItems > 5 ? (

              <p className="text-sm text-red-600">
                ⚠ Attention required. Multiple items are below
                reorder level.
              </p>

            ) : (

              <p className="text-sm text-green-600">
                ✓ Inventory level is stable.
              </p>

            )
          }

        </div>


      </DialogContent>



      <DialogActions>

        <Button
          onClick={onClose}
          variant="contained"
        >
          Close
        </Button>

      </DialogActions>


    </Dialog>
  );
}