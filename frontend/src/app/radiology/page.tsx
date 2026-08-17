import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";

function RadiologyPage() {
  return (
    <ModuleCapabilityGate module="radiology">
      <main style={{ padding: "2rem" }}>
        <h1>Radiology</h1>
      </main>
    </ModuleCapabilityGate>
  );
}

export default RadiologyPage;
