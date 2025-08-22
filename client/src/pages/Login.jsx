import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { useState } from "react";

export default function Login() {
  const { login, error, setUser } = useAuth(); // 👈 include setUser
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/"; // 👈 default to home now

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ username, password });

    if (res.ok) {
      setUser(res.user); // 👈 save user in context
      nav(from, { replace: true }); // 👈 redirect to Home
    }
  };

  return (
    <main>
      <h1>Log in</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, maxWidth: 360 }}
      >
        <input
          value={username}
          onChange={(e) => setU(e.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setP(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button>Log in</button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </main>
  );
}
