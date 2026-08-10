"use client";

import type { OpdVisit } from "@/features/opd/types";
import { Button } from "@/components/ui/button";

type ReceiptPrintViewProps = {
  visit: OpdVisit;
};

export function ReceiptPrintView({ visit }: ReceiptPrintViewProps) {
  const date = new Date(visit.createdAt).toLocaleString("en-IN");

  return (
    <div
      id="opd-fee-receipt"
      className="mx-auto max-w-md rounded-xl border border-border bg-white p-6 text-black print:border-0 print:shadow-none"
    >
      <div className="border-b border-dashed border-zinc-300 pb-4 text-center">
        <p className="text-lg font-bold">City Care Hospital</p>
        <p className="text-xs">OPD Token Fee Receipt</p>
      </div>

      <div className="space-y-2 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <span>Receipt No.</span>
          <span className="font-semibold">{visit.receiptNumber}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Date</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>UHID</span>
          <span className="font-semibold">{visit.uhid}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>OPD ID</span>
          <span>{visit.opdId}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Patient</span>
          <span>{visit.patientName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Doctor</span>
          <span>{visit.doctorName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Department</span>
          <span>{visit.department}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Token</span>
          <span className="text-lg font-bold">{visit.tokenNumber}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-dashed border-zinc-300 pt-2">
          <span>Amount Paid</span>
          <span className="text-lg font-bold">₹{visit.tokenFee}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Payment</span>
          <span className="uppercase">{visit.paymentMethod}</span>
        </div>
      </div>

      <p className="border-t border-dashed border-zinc-300 pt-4 text-center text-xs text-zinc-500">
        Please keep this receipt for your records.
      </p>
    </div>
  );
}

type ReceiptStepProps = {
  visit: OpdVisit;
  onBack: () => void;
  onPrint: () => void;
  onAddToQueue: () => void;
};

export function ReceiptStep({ visit, onBack, onPrint, onAddToQueue }: ReceiptStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Fee Receipt</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Payment collected successfully. Print the receipt and add the patient to the doctor queue.
        </p>
      </div>

      <ReceiptPrintView visit={visit} />

      <div className="flex flex-wrap gap-3 print:hidden">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="outline" onClick={onPrint}>
          Print Receipt
        </Button>
        <Button type="button" onClick={onAddToQueue}>
          Add to Doctor Queue
        </Button>
      </div>
    </div>
  );
}
