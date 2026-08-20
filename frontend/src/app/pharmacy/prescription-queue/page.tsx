import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";

function PharmacyPrescriptionQueuePage() {
  return (
    <ModuleCapabilityGate module="pharmacy">
      <main style={{ padding: "2rem" }}>
        <h1>Pharmacy / Prescription Queue</h1>
      </main>
    </ModuleCapabilityGate>
  );
}

export default PharmacyPrescriptionQueuePage;
