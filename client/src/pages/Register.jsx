import { useState } from "react";
import { useAuth } from "../lib/auth.jsx";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, error } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [dueDate, setDueDate] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ username, password, dueDate });
    if (res.ok) nav("/journal", { replace: true });
  };

  return (
    <main className="container">
      <h1>Create an account</h1>
      <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <input value={username} onChange={(e) => setU(e.target.value)} placeholder="Username" required />
        <input value={password} onChange={(e) => setP(e.target.value)} placeholder="Password" type="password" required />
        <label>
          Due date
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </label>
        <button>Register</button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </main>
  );
}
