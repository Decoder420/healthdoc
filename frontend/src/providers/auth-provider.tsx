"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearAuthToken,
  getAuthUserFromCookie,
  setAuthSession,
  type AuthUser,
} from "@/lib/auth";
import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  updateUser: () => undefined,
  logout: () => undefined,
});

const DEFAULT_USER: AuthUser = {
  id: "dev-1",
  name: "Priya Nair",
  email: "priya.nair@hospital.com",
  role: ROLES.RECEPTIONIST,
};

const LOGGED_OUT_KEY = "hms-auth-logged-out";

/** Dev stub — cookie session until Keycloak (F1-W1-03) lands. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fromCookie = getAuthUserFromCookie();
    if (fromCookie) {
      sessionStorage.removeItem(LOGGED_OUT_KEY);
      setUser(fromCookie);
      setIsLoading(false);
      return;
    }

    const intentionallyLoggedOut =
      typeof window !== "undefined" &&
      sessionStorage.getItem(LOGGED_OUT_KEY) === "1";

    if (!intentionallyLoggedOut) {
      setAuthSession(DEFAULT_USER, "dev-token");
      setUser(DEFAULT_USER);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      setAuthSession(next, "dev-token");
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    sessionStorage.setItem(LOGGED_OUT_KEY, "1");
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      updateUser,
      logout,
    }),
    [user, isLoading, updateUser, logout]
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
