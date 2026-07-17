import PathologyQueueClient from "@/components/dashboard/lab/lab_queue/LabQueue";
import { patients } from "@/lib/mock/lab_data";

export default function Page() {
  return <PathologyQueueClient initialPatients={patients} />;
}
