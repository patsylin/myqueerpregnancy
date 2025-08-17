import { useEffect, useState } from "react";

const checks = [
  { key: "weeks", label: "GET /api/weeks", url: "/api/weeks" },
  {
    key: "me",
    label: "GET /api/auth/me",
    url: "/api/auth/me",
    credentials: true,
  },
  {
    key: "journal",
    label: "GET /api/journal",
    url: "/api/journal",
    credentials: true,
  },
];

export default function StatusDashboard() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runChecks = async () => {
    setLoading(true);
    const out = {};
    for (const c of checks) {
      try {
        const res = await fetch(c.url, {
          method: "GET",
          credentials: c.credentials ? "include" : "same-origin",
        });
        // classify result
        if (res.ok) {
          out[c.key] = { status: "ok", code: res.status };
        } else if (res.status === 401 || res.status === 403) {
          out[c.key] = { status: "unauth", code: res.status };
        } else {
          const txt = await res.text().catch(() => "");
          out[c.key] = {
            status: "error",
            code: res.status,
            detail: snippet(txt),
          };
        }
      } catch (e) {
        out[c.key] = {
          status: "down",
          code: 0,
          detail: String(e?.message || e),
        };
      }
    }
    setResults(out);
    setLoading(false);
  };

  useEffect(() => {
    runChecks();
  }, []);

  return (
    <div className="status-card">
      <div className="status-header">
        <h2>System status</h2>
        <button onClick={runChecks} disabled={loading}>
          {loading ? "Checking…" : "Re-run checks"}
        </button>
      </div>

      <ul className="status-list">
        {checks.map((c) => {
          const r = results[c.key];
          return (
            <li key={c.key} className="status-row">
              <span className="status-label">{c.label}</span>
              <StatusBadge state={r?.status} code={r?.code} />
              {r?.detail && <pre className="status-detail">{r.detail}</pre>}
            </li>
          );
        })}
      </ul>

      <p className="status-note">
        Tip: <strong>auth/me</strong> may show <em>Unauthenticated</em> until
        you log in from the app.
      </p>
    </div>
  );
}

function StatusBadge({ state, code }) {
  const map = {
    ok: { text: "OK", cls: "ok" },
    unauth: { text: "Unauth", cls: "warn" },
    error: { text: `Error ${code}`, cls: "err" },
    down: { text: "Down", cls: "err" },
    undefined: { text: "Pending", cls: "muted" },
  };
  const { text, cls } = map[state ?? "undefined"];
  return <span className={`status-badge ${cls}`}>{text}</span>;
}

function snippet(s, n = 140) {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}
