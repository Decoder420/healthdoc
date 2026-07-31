"use client";

import { useState } from "react";
import ReturnMedicineDialog from "./ReturnMedicineDialog";

export default function ReturnMedicineRequest() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="surface-card p-5">
        <h2 className="text-lg font-semibold text-[#001F54]">
          Return Medicine Requests
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          3 pending requests
        </p>

        <button
          className="btn btn-primary mt-4"
          onClick={() => setOpen(true)}
        >
          View Requests
        </button>
      </div>

      <ReturnMedicineDialog
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}