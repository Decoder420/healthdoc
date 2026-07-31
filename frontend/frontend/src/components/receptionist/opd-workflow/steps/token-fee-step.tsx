"use client";

import type { Patient } from "@/features/patients/types";
import type { PaymentMethod } from "@/features/opd/types";
import { Button } from "@/components/ui/button";
import {
  FormField,
  InfoCard,
  SelectInput,
} from "@/components/receptionist/opd-workflow/form-controls";

type TokenFeeStepProps = {
  patient: Patient;
  opdId: string;
  tokenNumber: string;
  tokenFee: number;
  paymentMethod: PaymentMethod;
  doctorName: string;
  department: string;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onCollectFee: () => void;
};

export function TokenFeeStep({
  patient,
  opdId,
  tokenNumber,
  tokenFee,
  paymentMethod,
  doctorName,
  department,
  onPaymentMethodChange,
  onBack,
  onCollectFee,
}: TokenFeeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Token & Fee Collection</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Token number has been generated. Collect the OPD token fee to proceed.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="UHID">
          <p className="font-sans font-semibold text-primary">{patient.uhid}</p>
        </InfoCard>
        <InfoCard title="OPD ID">
          <p className="font-sans font-semibold text-foreground">{opdId}</p>
        </InfoCard>
        <InfoCard title="Token Number">
          <p className="font-sans text-2xl font-bold text-primary">{tokenNumber}</p>
        </InfoCard>
        <InfoCard title="Token Fee">
          <p className="font-sans text-2xl font-bold text-foreground">₹{tokenFee}</p>
        </InfoCard>
      </div>

      <div className="surface-card grid gap-4 p-6 md:grid-cols-2">
        <InfoCard title="Doctor">
          <p className="font-sans text-sm text-foreground">{doctorName}</p>
        </InfoCard>
        <InfoCard title="Department">
          <p className="font-sans text-sm text-foreground">{department}</p>
        </InfoCard>
        <FormField label="Payment Method" className="md:col-span-2">
          <SelectInput
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(event.target.value as PaymentMethod)
            }
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </SelectInput>
        </FormField>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onCollectFee}>
          Collect ₹{tokenFee} & Generate Receipt
        </Button>
      </div>
    </div>
  );
}
