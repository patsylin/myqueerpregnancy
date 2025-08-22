import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { setUser } = useAuth(); // 👈 pull from context

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register({ username, password, dueDate });
      setUser(data.user); // 👈 save new user
      nav("/", { replace: true }); // 👈 send to home
    } catch (err) {
      console.error(err);
      if (
        err.code === "USERNAME_TAKEN" ||
        err.status === 409 ||
        /Username.*taken/i.test(err.message || "")
      ) {
        setError("That username is already in use — please pick another!");
      } else if (err.code === "VALIDATION_ERROR" || err.status === 400) {
        setError(err.message || "Please fill in all required fields.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{ maxWidth: 420, margin: "2rem auto", display: "grid", gap: 12 }}
    >
      <h2 style={{ margin: 0 }}>Create an account</h2>

      {error && (
        <p role="alert" style={{ color: "red", margin: 0 }}>
          {error}
        </p>
      )}

      {/* ...inputs... */}
      <label style={{ display: "grid", gap: 6 }}>
        <span>Username</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          minLength={6}
          required
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Due date</span>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Creating account…" : "Register"}
      </button>
    </form>
  );
}
