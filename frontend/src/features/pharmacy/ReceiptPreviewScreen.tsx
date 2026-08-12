"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useMemo } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import {
  ArrowLeft,
  Printer,
  Download,
} from "lucide-react";

import {
  patient,
  medicines,
  dispenseReceiptData,
} from "@/features/pharmacy/data/dispenseData";

export default function ReceiptPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prescriptionId =
    searchParams.get("prescription");

  const receipt = useMemo(() => {
    return {
      ...dispenseReceiptData,
      patient,
      medicines: medicines.filter(
        (medicine) => medicine.dispenseQty > 0
      ),
    };
  }, []);

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#001F54"
          >
            Dispense Receipt
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Prescription:{" "}
            {prescriptionId || patient.prescriptionNumber}
          </Typography>
        </div>

        <div className="flex gap-3">

          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() =>
              router.push("/pharmacy/prescription-queue")
            }
          >
            Back to Queue
          </Button>

          <Button
            variant="outlined"
            startIcon={<Printer size={18} />}
            onClick={() => window.print()}
          >
            Print
          </Button>

          <Button
            variant="contained"
            startIcon={<Download size={18} />}
            onClick={() => {
              window.print();
            }}
          >
            Download
          </Button>

        </div>
      </div>

      {/* Receipt */}

      <Card
        sx={{
          maxWidth: 900,
          mx: "auto",
          boxShadow: 2,
        }}
      >
        <CardContent sx={{ p: 5 }}>

          {/* Hospital */}

          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              color="#001F54"
            >
              Hospital Pharmacy
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Medicine Dispensing Receipt
            </Typography>
          </Box>

          <Divider />

          {/* Receipt information */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 2,
              my: 3,
            }}
          >

            <div>
              <Typography variant="caption">
                Receipt No
              </Typography>

              <Typography fontWeight={600}>
                {receipt.receiptNo}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                Dispense Date
              </Typography>

              <Typography fontWeight={600}>
                {receipt.dispenseDate}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                Patient
              </Typography>

              <Typography fontWeight={600}>
                {receipt.patient.patientName}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                UHID
              </Typography>

              <Typography fontWeight={600}>
                {receipt.patient.uhid}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                Doctor
              </Typography>

              <Typography fontWeight={600}>
                {receipt.patient.doctor}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                Prescription
              </Typography>

              <Typography fontWeight={600}>
                {receipt.patient.prescriptionNumber}
              </Typography>
            </div>

          </Box>

          <Divider />

          {/* Medicines */}

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mt: 3, mb: 2 }}
          >
            Dispensed Medicines
          </Typography>

          <div className="overflow-x-auto">

            <table className="min-w-full border-collapse">

              <thead>
                <tr className="border-b">
                  <th className="px-3 py-3 text-left">
                    Medicine
                  </th>

                  <th className="px-3 py-3 text-left">
                    Batch
                  </th>

                  <th className="px-3 py-3 text-left">
                    Expiry
                  </th>

                  <th className="px-3 py-3 text-center">
                    Prescribed
                  </th>

                  <th className="px-3 py-3 text-center">
                    Dispensed
                  </th>

                  <th className="px-3 py-3 text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {receipt.medicines.map((medicine) => {

                  const status =
                    medicine.dispenseQty >=
                    medicine.prescribedQty
                      ? "Full"
                      : "Partial";

                  return (
                    <tr
                      key={medicine.id}
                      className="border-b"
                    >

                      <td className="px-3 py-3">
                        {medicine.medicineName}
                      </td>

                      <td className="px-3 py-3">
                        {medicine.batchNumber || "--"}
                      </td>

                      <td className="px-3 py-3">
                        {medicine.expiryDate || "--"}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {medicine.prescribedQty}
                      </td>

                      <td className="px-3 py-3 text-center font-semibold">
                        {medicine.dispenseQty}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {status}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          <Divider sx={{ my: 3 }} />

          {/* Footer */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >

            <div>
              <Typography variant="caption">
                Pharmacist
              </Typography>

              <Typography fontWeight={600}>
                {receipt.pharmacist}
              </Typography>
            </div>

            <div className="text-right">
              <Typography variant="caption">
                Total Medicines
              </Typography>

              <Typography fontWeight={600}>
                {receipt.medicines.length}
              </Typography>
            </div>

          </Box>

        </CardContent>
      </Card>
    </div>
  );
}