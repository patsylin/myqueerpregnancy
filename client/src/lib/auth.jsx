// client/src/lib/auth.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [pregnancy, setPregnancy] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState("");

  function saveToken(t) {
    setToken(t || "");
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  }

  async function fetchMe(t = token) {
    if (!t) return; // ⬅️ prevents 401 spam before login
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load profile");
      setUser(data.user || null);
      setPregnancy(data.pregnancy || null);
    } catch (e) {
      setError(e.message);
      setUser(null);
      setPregnancy(null);
      saveToken("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchMe(token);
  }, [token]);

  async function register({ username, password, dueDate }) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password, dueDate }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.message || data?.error || "Registration failed");
    saveToken(data.token);
    await fetchMe(data.token);
    return data;
  }

  async function login({ username, password }) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.message || data?.error || "Login failed");
    saveToken(data.token);
    await fetchMe(data.token);
    return data;
  }

  async function logout() {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setUser(null);
    setPregnancy(null);
    saveToken("");
  }

  const value = useMemo(
    () => ({ token, user, pregnancy, loading, error, register, login, logout }),
    [token, user, pregnancy, loading, error]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
