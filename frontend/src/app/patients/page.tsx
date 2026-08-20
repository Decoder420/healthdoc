import { redirect } from "next/navigation";

/** Canonical search UI lives on the receptionist route. */
export default function PatientsPage() {
  redirect("/receptionist/patient-search");
}
