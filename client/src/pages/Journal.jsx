// client/src/pages/Journal.jsx
import { useEffect, useState } from "react";

export default function Journal() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    const res = await fetch("/api/journal", { credentials: "include" });
    const data = await res.json();
    if (res.ok && Array.isArray(data)) setItems(data);
    else setErr(data?.error?.message || "Failed to load journal");
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      setText("");
      load();
    } else {
      const d = await res.json();
      setErr(d?.error?.message || "Failed to create");
    }
  };

  return (
    <main>
      <h1>Journal</h1>
      <form
        onSubmit={create}
        style={{ display: "grid", gap: 8, maxWidth: 600 }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Write a new entry..."
        />
        <button>Add entry</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <ul style={{ padding: 0, listStyle: "none", marginTop: 16 }}>
        {items.map((it) => (
          <li
            key={it.id}
            style={{
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              {new Date(it.created_at || it.createdAt).toLocaleString()}
            </div>
            <div>{it.content}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
