"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Role } from "@/config/roles";
import {
  type AuthUser,
  clearAuthToken,
  getAuthUser,
  hasSessionPresence,
  setAuthSession,
  setSessionPresence,
} from "@/lib/auth";
import { isDevAuthEnabled } from "@/lib/auth/mode";
import {
  getKeycloakSessionUser,
  initKeycloak,
  isKeycloakConfigured,
  logoutFromKeycloak,
} from "@/lib/auth/keycloak";
import { setAccessToken } from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  updateUser: () => undefined,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        // Explicit-dev UI scaffolding only — not production identity.
        if (isDevAuthEnabled()) {
          const stored = getAuthUser();
          if (stored && hasSessionPresence()) {
            setUser(stored);
          }
          return;
        }

        if (isKeycloakConfigured()) {
          const ok = await initKeycloak();
          if (cancelled) return;
          if (ok) {
            const session = getKeycloakSessionUser();
            if (session) {
              const next: AuthUser = {
                id: session.id,
                name: session.name,
                email: session.email,
                role: session.role,
              };
              setUser(next);
              setSessionPresence(next.role);
              return;
            }
          }
          clearAuthToken();
          setUser(null);
        }
      } catch (err) {
        console.error("[auth] Keycloak hydrate failed", err);
        if (!cancelled) {
          clearAuthToken();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateUser(nextUser: AuthUser) {
    setUser(nextUser);
    setAuthSession(nextUser);
  }

  async function logout() {
    setUser(null);
    setAccessToken(null);
    clearAuthToken();
    if (isKeycloakConfigured() && !isDevAuthEnabled()) {
      await logoutFromKeycloak();
    } else {
      window.location.href = "/login";
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        updateUser,
        logout,
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
