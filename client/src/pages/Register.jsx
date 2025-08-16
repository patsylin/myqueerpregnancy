// client/src/pages/Register.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

export default function Register() {
  const { register, error } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [confirm, setC] = useState("");
  const [localErr, setLocalErr] = useState("");

  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/journal";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");

    if (password.length < 6) {
      setLocalErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setLocalErr("Passwords do not match.");
      return;
    }

    const res = await register({ username, password });
    if (res.ok) nav(from, { replace: true });
    // If not ok, AuthProvider exposes `error`, shown below
  };

  return (
    <main>
      <h1>Create account</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, maxWidth: 360 }}
      >
        <input
          value={username}
          onChange={(e) => setU(e.target.value)}
          placeholder="Username"
          autoComplete="username"
        />
        <input
          value={password}
          onChange={(e) => setP(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="new-password"
        />
        <input
          value={confirm}
          onChange={(e) => setC(e.target.value)}
          placeholder="Confirm password"
          type="password"
          autoComplete="new-password"
        />
        <button>Create account</button>

        {(localErr || error) && (
          <div style={{ color: "crimson" }}>{localErr || error}</div>
        )}
      </form>
    </main>
  );
}
