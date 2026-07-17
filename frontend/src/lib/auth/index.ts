export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: import("@/config/roles").Role;
};

export * from "./session";
export * from "./routes";
