const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [pregnancy, setPregnancy] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState("");

  // helper: save/remove token
  function saveToken(t) {
    setToken(t || "");
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  }

  async function fetchMe(t = token) {
    if (!t) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
        credentials: "include", // harmless if you don't use cookies
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load profile");
      setUser(data.user || null);
      setPregnancy(data.pregnancy || null); // { dueDate, weeks, days, category }
    } catch (e) {
      setError(e.message);
      setUser(null);
      setPregnancy(null);
      saveToken("");
    } finally {
      setLoading(false);
    }
  }

  // on mount / token change, load profile
  useEffect(() => {
    if (token) fetchMe(token);
  }, [token]);

  // API helpers
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
    // You can inspect data.needsDueDate here and redirect to /onboarding/due-date if true.
  }

  async function logout() {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
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
