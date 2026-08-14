import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLES, type Role } from "@/config/roles";
import { getDefaultRouteForRole } from "@/lib/auth/routes";

export default async function HomePage() {
  const jar = await cookies();
  const hasSession =
    jar.get("hd_session")?.value === "1" || Boolean(jar.get("auth-token")?.value);

  if (!hasSession) {
    redirect("/login");
  }

  const role = (jar.get("hd_role_hint")?.value ||
    jar.get("auth-role")?.value) as Role | undefined;
  const destination =
    role && Object.values(ROLES).includes(role)
      ? getDefaultRouteForRole(role)
      : "/dashboard";

  redirect(destination);
}
