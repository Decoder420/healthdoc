import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import { PrescriptionQueue } from "@/features/pharmacy/PrescriptionQueue";

function PharmacyPrescriptionQueuePage() {
  return (
    <ModuleCapabilityGate module="pharmacy">
      <PrescriptionQueue />
    </ModuleCapabilityGate>
  );
}

export default PharmacyPrescriptionQueuePage;
