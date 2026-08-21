"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Role } from "@/config/roles";
import { ROLES } from "@/config/roles";

import {
  type AuthUser,
  getAuthToken,
  getAuthUser,
  setAuthSession,
} from "@/lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  updateUser: () => undefined,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getAuthUser();

    if (token && storedUser) {
      setUser(storedUser);
    } else if (token) {
      setUser({
        id: "dev-1",
        name: "Priya Nair",
        email: "priya.nair@hospital.com",
        role: ROLES.RECEPTIONIST,

        // Reception user is not department-bound
        departmentId: undefined,
        departmentName: undefined,
      });
    }

    setIsLoading(false);
  }, []);

  function updateUser(nextUser: AuthUser) {
    setUser(nextUser);

    setAuthSession(
      nextUser,
      getAuthToken() || "dev-token",
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useUserRole(): Role | null {
  const { user } = useAuth();

  return user?.role ?? null;
}