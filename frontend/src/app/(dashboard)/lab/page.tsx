import { redirect } from "next/navigation";

/** Lab role home → employee dashboard. */
export default function LabHomePage() {
  redirect("/lab/dashboard");
}
