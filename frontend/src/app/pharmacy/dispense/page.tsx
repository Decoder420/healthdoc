import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";
import { PrescriptionQueue } from "@/features/pharmacy/PrescriptionQueue";

function PharmacyDispensePage() {
  return (
    <ModuleCapabilityGate module="pharmacy">
      <PrescriptionQueue dispenseMode />
    </ModuleCapabilityGate>
  );
}

export default PharmacyDispensePage;
