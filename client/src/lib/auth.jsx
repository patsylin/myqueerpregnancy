mkdir -p client/src/lib
cat > client/src/lib/auth.jsx <<'EOF'
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_BASE || "/api";
const AuthCtx = createContext(null);

function isOffline404(err) {
  return err?.offline === true || err?.status === 404;
}

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    if (res.status === 404) {
      const e = new Error("offline");
      e.offline = true;
      e.status = 404;
      throw e;
    }
    return res;
  } catch (e) {
    if (e.offline) throw e;
    throw e;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await safeFetch(`${API}/auth/me`, { credentials: "include" });
        const j = await res.json();
        if (res.ok && j) setUser(j);
      } catch (e) {
        const u = JSON.parse(localStorage.getItem("demoUser") || "null");
        if (u) setUser(u);
      }
    })();
  }, []);

  async function register({ username, password, dueDate }) {
    setError("");
    try {
      const res = await safeFetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, dueDate }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Registration failed");
      setUser(j.user || j);
      return { ok: true, needsDueDate: !j.user?.dueDate };
    } catch (e) {
      if (isOffline404(e)) {
        const u = { id: "demo", username, dueDate: dueDate || null };
        localStorage.setItem("demoUser", JSON.stringify(u));
        setUser(u);
        return { ok: true, needsDueDate: !dueDate };
      }
      setError(e.message || "Registration failed");
      return { ok: false };
    }
  }

  async function login({ username, password }) {
    setError("");
    try {
      const res = await safeFetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Login failed");
      setUser(j.user || j);
      return { ok: true, needsDueDate: !(j.user?.dueDate || j?.dueDate) };
    } catch (e) {
      if (isOffline404(e)) {
        const u =
          JSON.parse(localStorage.getItem("demoUser") || "null") ||
          { id: "demo", username };
        localStorage.setItem("demoUser", JSON.stringify(u));
        setUser(u);
        return { ok: true, needsDueDate: !u?.dueDate };
      }
      setError(e.message || "Login failed");
      return { ok: false };
    }
  }

  function logout() {
    localStorage.removeItem("demoUser");
    setUser(null);
    fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  }

  const value = useMemo(() => ({ user, error, login, register, logout }), [user, error]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
EOF
