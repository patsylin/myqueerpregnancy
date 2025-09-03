import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";

export default function Login() {
  const { login, error, setUser } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/";

  // client/src/pages/Login.jsx (example)
  const onSubmit = async (e) => {
    e.preventDefault();
    const { ok, user, message } = await login({ username, password });
    if (!ok) {
      setError(message || "Login failed");
      return;
    }
    // proceed…
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const res = await login({ username, password });

  //   if (res.ok) {
  //     setUser(res.user);
  //     nav(from, { replace: true });
  //   }
  // };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-4">Log in</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            value={username}
            onChange={(e) => setU(e.target.value)}
            placeholder="Username"
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
          />
          <input
            value={password}
            onChange={(e) => setP(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border border-gray-300 px-3 py-2"
          />
          <button
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full
                       bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            {error ? "Try again" : "Log in"}
          </button>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </main>
  );
}
