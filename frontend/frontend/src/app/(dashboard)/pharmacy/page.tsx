import { redirect } from "next/navigation";

export default function PharmacyRedirectPage() {
  redirect("/pharmacy/prescription-queue");
}
