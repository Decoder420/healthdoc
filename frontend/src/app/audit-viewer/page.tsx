import { redirect } from "next/navigation";

/** Audit viewer lives under Admin governance — keep old URL working. */
export default function Page() {
  redirect("/admin/audit");
}
