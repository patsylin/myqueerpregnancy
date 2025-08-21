cat > client/src/pages/Journal.jsx <<'EOF'
import { useEffect, useState } from "react";

export default function Journal() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const res = await fetch("/api/journal", { credentials: "include" });
      if (res.status === 404) throw Object.assign(new Error("offline"), { offline: true });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setItems(data);
      else setErr(data?.error?.message || "Failed to load journal");
    } catch (e) {
      if (e.offline) {
        const stash = JSON.parse(localStorage.getItem("demoJournal") || "[]");
        setItems(stash);
      } else {
        setErr(e.message || "Failed to load journal");
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: text }),
      });
      if (res.status === 404) throw Object.assign(new Error("offline"), { offline: true });
      if (res.ok) {
        setText("");
        load();
      } else {
        const d = await res.json();
        setErr(d?.error?.message || "Failed to create");
      }
    } catch (e) {
      if (e.offline) {
        const entry = {
          id: crypto.randomUUID(),
          content: text,
          createdAt: new Date().toISOString(),
        };
        const stash = JSON.parse(localStorage.getItem("demoJournal") || "[]");
        stash.unshift(entry);
        localStorage.setItem("demoJournal", JSON.stringify(stash));
        setText("");
        setItems(stash);
      } else {
        setErr(e.message || "Failed to create");
      }
    }
  };

  return (
    <main className="container">
      <h1>Journal</h1>
      <form onSubmit={create} className="card" style={{ display: "grid", gap: 8, maxWidth: 600 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Write a new entry..."
        />
        <button>Add entry</button>
      </form>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <div style={{ marginTop: 16 }}>
        {items.map((it) => (
          <div className="card" key={it.id} style={{ marginBottom: 12 }}>
            <div className="muted" style={{ fontSize: 14 }}>
              {new Date(it.created_at || it.createdAt).toLocaleString()}
            </div>
            <div>{it.content}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
EOF
