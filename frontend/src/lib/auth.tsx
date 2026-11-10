import * as React from "react";
import { Navigate } from "react-router-dom";

import {
  UNAUTHORIZED_EVENT,
  apiFetch,
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from "@/lib/api";

export type User = { id: string; email: string };

type AuthValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(() => getSessionToken() !== null);

  React.useEffect(() => {
    let live = true;
    if (getSessionToken()) {
      apiFetch<User>("/auth/me")
        .then((me) => live && setUser(me))
        .catch(() => {
          clearSessionToken();
          if (live) setUser(null);
        })
        .finally(() => live && setLoading(false));
    }
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => {
      live = false;
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    };
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setSessionToken(res.token);
    setUser(res.user);
  }, []);

  const register = React.useCallback(
    async (email: string, password: string) => {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await signIn(email, password);
    },
    [signIn],
  );

  const signOut = React.useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Token already invalid server-side or unreachable: still drop it locally.
    }
    clearSessionToken();
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, signIn, register, signOut }),
    [user, loading, signIn, register, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Loading…</p>;
  if (!user || !getSessionToken()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
