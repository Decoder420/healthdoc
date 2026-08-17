import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";

function PharmacyDispensePage() {
  return (
    <ModuleCapabilityGate module="pharmacy">
      <main style={{ padding: "2rem" }}>
        <h1>Pharmacy / Dispense</h1>
      </main>
    </ModuleCapabilityGate>
  );
}

export default PharmacyDispensePage;
