"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser } from "@/lib/auth";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (patch: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  updateUser: () => undefined,
});

const DEFAULT_USER: AuthUser = {
  id: "dev-lab",
  name: "Dr. Sharma",
  email: "lab.sharma@hospital.com",
  role: ROLES.LAB_TECHNICIAN,
};

/** Dev stub — defaults to lab technician until Keycloak (F1-W1-03) lands. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_USER);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
      updateUser,
    }),
    [user, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useUserRole(): Role | null {
  return useAuth().user?.role ?? null;
}
