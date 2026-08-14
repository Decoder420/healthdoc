import { redirect } from "next/navigation";

/** Compat alias — canonical nurse workspace is under `/nurse/*`. */
export default function NursesRedirectPage() {
  redirect("/nurse/ward-dashboard");
}
