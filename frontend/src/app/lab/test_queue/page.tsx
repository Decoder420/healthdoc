import MainLayout from "@/components/common/MainLayout";
import PathologyQueueClient from "@/components/ui/lab_queue/LabQueue";
import { patients } from "@/lib/mock/lab_data";

export default function Page() {
  return (
    <MainLayout>
      <PathologyQueueClient initialPatients={patients as never} />
    </MainLayout>
  );
}
