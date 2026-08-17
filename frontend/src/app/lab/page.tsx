import { ModuleCapabilityGate } from "@/components/common/ModuleCapabilityGate";

function LabPage() {
  return (
    <ModuleCapabilityGate module="lab">
      <main style={{ padding: "2rem" }}>
        <h1>Lab</h1>
      </main>
    </ModuleCapabilityGate>
  );
}

export default LabPage;
