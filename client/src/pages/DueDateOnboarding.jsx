import { useState } from "react";

export default function DueDateOnboarding() {
  const [dueDate, setDueDate] = useState("");
  const [err, setErr] = useState("");

  const save = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) throw new Error("Not logged in");
      const res = await fetch("/api/onboarding/due-date", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, dueDate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      // after saving, bounce to your normal landing page
      window.location.href = "/journal";
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={save} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
      <h1>What’s your due date?</h1>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
}
