import PathologyQueueClient from "@/components/ui/lab_queue/LabQueue";
import Navbar from "@/components/shared/Navbar";
import { patients } from "@/lib/mock/lab_data";

export default function Page() {
  return (
   <>
      <Navbar/>
    
    <PathologyQueueClient
      initialPatients={patients}
    />
   </>
  );
}