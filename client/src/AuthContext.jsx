import { createContext, useContext, useEffect, useState } from "react";
import {
  me,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "./src/lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await me();
        if (res.ok && res.user) setUser(res.user);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(creds) {
    const res = await loginApi(creds);
    if (res.ok && res.user) setUser(res.user);
    return res;
  }

  async function register(payload) {
    return registerApi(payload);
  }

  async function logout() {
    await logoutApi();
    setUser(null);
  }

  return (
    <AuthCtx.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
