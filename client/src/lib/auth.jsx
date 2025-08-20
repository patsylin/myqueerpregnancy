import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "/api";
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // check existing session
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (res.ok && data && !data.error) setUser(data);
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, []);

  // ✅ updated login
  const login = async ({ username, password }) => {
    setError("");
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && !data.error) {
      // expect server returns: { token?, user, needsDueDate }
      // refresh /me to get user info
      const me = await fetch(`${API}/auth/me`, {
        credentials: "include",
      }).then((r) => r.json());
      setUser(me);

      return { ok: true, needsDueDate: !!data.needsDueDate, user: me };
    }

    setError(data?.error?.message || "Login failed");
    return { ok: false, error: data?.error?.message };
  };

  // ✅ updated register — pass dueDate too
  const register = async ({ username, password, dueDate }) => {
    setError("");
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password, dueDate }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && !data.error) {
      // auto-login after registration
      return login({ username, password });
    }

    setError(data?.error?.message || "Registration failed");
    return { ok: false, error: data?.error?.message };
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const value = { user, loading, error, login, register, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
