"use client";

import { createContext, useContext, useMemo } from "react";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

type AuthUser = {
  id: string;
  name: string;
  role: Role;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
});

/** Dev stub — defaults to lab role until Keycloak (F1-W1-03) lands. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: {
        id: "dev-lab",
        name: "Dr. Sharma",
        role: ROLES.LAB,
      },
      isAuthenticated: true,
    }),
    []
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
