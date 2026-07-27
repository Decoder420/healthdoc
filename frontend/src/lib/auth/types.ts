import type { Role } from "@/config/roles";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
